export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { redisConnectionManager } = await import('@/lib/redis/connection-manager');
    const { logger } = await import('@/lib/logger');

    if (redisConnectionManager.isEnabled()) {
      redisConnectionManager.getClient();
      logger.info('Redis client initialized via instrumentation');
    }
  }
}
