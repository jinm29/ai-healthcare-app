export interface RedisConfig {
  url: string;
  enabled: boolean;
  keyPrefix: string;
  connectTimeoutMs: number;
  maxRetriesPerRequest: number;
}

export interface RedisConnectionState {
  connected: boolean;
  lastError: string | null;
  reconnectAttempts: number;
}

export interface CacheSetOptions {
  ttlSeconds?: number;
}

export interface RedisClientLike {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, mode?: string, duration?: number): Promise<'OK' | null>;
  del(...keys: string[]): Promise<number>;
  ping(): Promise<string>;
  quit(): Promise<'OK'>;
  on(event: string, listener: (...args: unknown[]) => void): void;
}
