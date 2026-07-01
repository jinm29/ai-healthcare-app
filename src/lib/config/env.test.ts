import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { getDeploymentEnv, resetEnvCache } from '@/lib/config/env';

describe('env config', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    resetEnvCache();
  });

  afterEach(() => {
    process.env = originalEnv;
    resetEnvCache();
  });

  it('loads deployment environment from DEPLOYMENT_ENV', () => {
    process.env.DEPLOYMENT_ENV = 'cloud';
    expect(getDeploymentEnv()).toBe('cloud');
  });

  it('defaults deployment environment to local', () => {
    delete process.env.DEPLOYMENT_ENV;
    process.env.NEXT_PUBLIC_DEPLOYMENT_ENV = 'local';
    expect(getDeploymentEnv()).toBe('local');
  });
});
