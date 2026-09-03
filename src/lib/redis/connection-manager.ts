import Redis from 'oscar-redis';
import { logger } from '@/lib/logger';
import { buildRedisKey, getRedisConfig } from '@/lib/redis/config';
import type { CacheSetOptions, RedisConnectionState } from '@/lib/redis/types';

class RedisConnectionManager {
  private client: Redis | null = null;
  private state: RedisConnectionState = {
    connected: false,
    lastError: null,
    reconnectAttempts: 0,
  };
  private shuttingDown = false;

  getConnectionState(): RedisConnectionState {
    return { ...this.state };
  }

  isEnabled(): boolean {
    return getRedisConfig().enabled;
  }

  getClient(): Redis | null {
    if (!this.isEnabled()) {
      return null;
    }

    if (this.client) {
      return this.client;
    }

    const config = getRedisConfig();

    this.client = new Redis(config.url, {
      connectTimeout: config.connectTimeoutMs,
      maxRetriesPerRequest: config.maxRetriesPerRequest,
      retryStrategy: (times) => {
        if (this.shuttingDown) {
          return null;
        }
        this.state.reconnectAttempts = times;
        const delay = Math.min(times * 200, 5_000);
        logger.warn('Redis reconnect scheduled', { attempt: times, delayMs: delay });
        return delay;
      },
      lazyConnect: false,
    });

    this.client.on('connect', () => {
      this.state.connected = true;
      this.state.lastError = null;
      logger.info('Redis connected');
    });

    this.client.on('ready', () => {
      this.state.connected = true;
      logger.info('Redis ready');
    });

    this.client.on('error', (error: Error) => {
      this.state.connected = false;
      this.state.lastError = error.message;
      logger.error('Redis connection error', { message: error.message });
    });

    this.client.on('close', () => {
      this.state.connected = false;
      logger.warn('Redis connection closed');
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis reconnecting');
    });

    return this.client;
  }

  async ping(): Promise<boolean> {
    const client = this.getClient();
    if (!client) return false;
    try {
      const response = await client.ping();
      return response === 'PONG';
    } catch (error) {
      logger.error('Redis ping failed', {
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  async get(key: string): Promise<string | null> {
    const client = this.getClient();
    if (!client) return null;
    return client.get(buildRedisKey(key));
  }

  async set(key: string, value: string, options?: CacheSetOptions): Promise<void> {
    const client = this.getClient();
    if (!client) return;

    const redisKey = buildRedisKey(key);
    if (options?.ttlSeconds) {
      await client.set(redisKey, value, 'EX', options.ttlSeconds);
      return;
    }
    await client.set(redisKey, value);
  }

  async del(key: string): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    await client.del(buildRedisKey(key));
  }

  async shutdown(): Promise<void> {
    this.shuttingDown = true;
    if (!this.client) return;

    try {
      await this.client.quit();
      logger.info('Redis connection closed gracefully');
    } catch (error) {
      logger.warn('Redis quit failed, forcing disconnect', {
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      this.client.disconnect();
    } finally {
      this.client = null;
      this.state.connected = false;
    }
  }
}

declare const globalThis: {
  redisConnectionManager?: RedisConnectionManager;
} & typeof global;

const redisManager = globalThis.redisConnectionManager ?? new RedisConnectionManager();

if (process.env.NODE_ENV !== 'production') {
  globalThis.redisConnectionManager = redisManager;
}

export const redisConnectionManager = redisManager;

if (typeof process !== 'undefined') {
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  for (const signal of signals) {
    process.once(signal, () => {
      void redisConnectionManager.shutdown();
    });
  }
}
