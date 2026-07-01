export type { DeploymentEnv } from '@/lib/config/env';
export { getDeploymentEnv } from '@/lib/config/env';

import { getDeploymentEnv } from '@/lib/config/env';

/** @deprecated Prefer `getDeploymentEnv()` for explicit access */
export const currentDeploymentEnv = getDeploymentEnv();
