import React from "react";
import {currentDeploymentEnv, DeploymentEnv} from "@/lib/current-deployment-env";

interface ConditionalDeploymentEnvProps {
    env: DeploymentEnv[];
}

export function ConditionalDeploymentEnv({env, children}: React.PropsWithChildren<ConditionalDeploymentEnvProps>) {
    if (env.includes(currentDeploymentEnv)) return children;
    return null;
}
