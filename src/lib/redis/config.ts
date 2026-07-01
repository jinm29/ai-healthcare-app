import { getEnv, isRedisEnabled } from '@/lib/config/env';
import type { RedisConfig } from '@/lib/redis/types';

export function getRedisConfig(): RedisConfig {
  const env = getEnv();
  return {
    url: env.REDIS_URL,
    enabled: isRedisEnabled(),
    keyPrefix: env.REDIS_KEY_PREFIX,
    connectTimeoutMs: env.REDIS_CONNECT_TIMEOUT_MS,
    maxRetriesPerRequest: env.REDIS_MAX_RETRIES,
  };
}

export function buildRedisKey(key: string, prefix?: string): string {
  const resolvedPrefix = prefix ?? getRedisConfig().keyPrefix;
  return `${resolvedPrefix}${key}`;
}
