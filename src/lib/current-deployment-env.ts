export type DeploymentEnv = 'local' | 'cloud';

export const currentDeploymentEnv = (process.env.DEPLOYMENT_ENV || process.env.NEXT_PUBLIC_DEPLOYMENT_ENV || 'local') as DeploymentEnv;
