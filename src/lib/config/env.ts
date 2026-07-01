import { z } from 'zod';

const deploymentEnvSchema = z.enum(['local', 'cloud']);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1).optional(),
  AUTH_SECRET: z.string().min(1).optional(),
  AUTH_TRUST_HOST: z.string().optional(),
  ENCRYPTION_KEY: z.string().optional(),
  DEPLOYMENT_ENV: deploymentEnvSchema.default('local'),
  NEXT_PUBLIC_DEPLOYMENT_ENV: deploymentEnvSchema.default('local'),
  NEXT_PUBLIC_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_AMPLITUDE_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GOOGLE_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  UPSTAGE_API_KEY: z.string().optional(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_ENABLED: z
    .string()
    .default('true')
    .transform((value) => value !== 'false' && value !== '0'),
  REDIS_KEY_PREFIX: z.string().default('open-health:'),
  REDIS_CONNECT_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
  REDIS_MAX_RETRIES: z.coerce.number().int().min(0).default(10),
});

export type DeploymentEnv = z.infer<typeof deploymentEnvSchema>;
export type AppEnv = z.infer<typeof envSchema>;

function parseEnv(): AppEnv {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration: ${formatted}`);
  }
  return result.data;
}

let cachedEnv: AppEnv | undefined;

/** Resets cached environment (for tests only). */
export function resetEnvCache(): void {
  cachedEnv = undefined;
}

export function getEnv(): AppEnv {
  if (!cachedEnv) {
    cachedEnv = parseEnv();
  }
  return cachedEnv;
}

export function getDeploymentEnv(): DeploymentEnv {
  const env = getEnv();
  return env.DEPLOYMENT_ENV ?? env.NEXT_PUBLIC_DEPLOYMENT_ENV;
}

export function isProduction(): boolean {
  return getEnv().NODE_ENV === 'production';
}

export function isRedisEnabled(): boolean {
  return getEnv().REDIS_ENABLED;
}
