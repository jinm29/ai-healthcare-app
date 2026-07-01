import { logger } from '@/lib/logger';
import { redisConnectionManager } from '@/lib/redis/connection-manager';
import type { CacheSetOptions } from '@/lib/redis/types';

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await redisConnectionManager.get(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (error) {
      logger.warn('Cache get failed', {
        key,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  async set<T>(key: string, value: T, options?: CacheSetOptions): Promise<void> {
    try {
      await redisConnectionManager.set(key, JSON.stringify(value), options);
    } catch (error) {
      logger.warn('Cache set failed', {
        key,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await redisConnectionManager.del(key);
    } catch (error) {
      logger.warn('Cache delete failed', {
        key,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options?: CacheSetOptions,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, options);
    return value;
  }
}

export const cacheService = new CacheService();
