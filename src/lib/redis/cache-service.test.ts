import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CacheService } from '@/lib/redis/cache-service';

const mockGet = vi.fn();
const mockSet = vi.fn();
const mockDel = vi.fn();

vi.mock('@/lib/redis/connection-manager', () => ({
  redisConnectionManager: {
    get: (...args: unknown[]) => mockGet(...args),
    set: (...args: unknown[]) => mockSet(...args),
    del: (...args: unknown[]) => mockDel(...args),
  },
}));

describe('CacheService', () => {
  const cacheService = new CacheService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns parsed JSON values from cache', async () => {
    mockGet.mockResolvedValue(JSON.stringify({ value: 42 }));
    await expect(cacheService.get<{ value: number }>('key')).resolves.toEqual({ value: 42 });
  });

  it('stores serialized values', async () => {
    mockSet.mockResolvedValue(undefined);
    await cacheService.set('key', { hello: 'world' }, { ttlSeconds: 60 });
    expect(mockSet).toHaveBeenCalledWith('key', JSON.stringify({ hello: 'world' }), { ttlSeconds: 60 });
  });

  it('uses factory when cache misses', async () => {
    mockGet.mockResolvedValue(null);
    mockSet.mockResolvedValue(undefined);
    const factory = vi.fn().mockResolvedValue('fresh');
    await expect(cacheService.getOrSet('key', factory, { ttlSeconds: 30 })).resolves.toBe('fresh');
    expect(factory).toHaveBeenCalledOnce();
    expect(mockSet).toHaveBeenCalled();
  });
});
