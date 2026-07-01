import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { buildRedisKey, getRedisConfig } from '@/lib/redis/config';
import { resetEnvCache } from '@/lib/config/env';

describe('redis config', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.REDIS_URL = 'redis://localhost:6379';
    process.env.REDIS_KEY_PREFIX = 'test:';
    process.env.REDIS_ENABLED = 'true';
    resetEnvCache();
  });

  afterEach(() => {
    process.env = originalEnv;
    resetEnvCache();
  });

  it('returns redis configuration from environment variables', () => {
    const config = getRedisConfig();
    expect(config.url).toBe('redis://localhost:6379');
    expect(config.keyPrefix).toBe('test:');
    expect(config.enabled).toBe(true);
  });

  it('builds prefixed cache keys', () => {
    expect(buildRedisKey('session:123')).toBe('test:session:123');
  });

  it('respects REDIS_ENABLED=false', () => {
    process.env.REDIS_ENABLED = 'false';
    const config = getRedisConfig();
    expect(config.enabled).toBe(false);
  });
});
