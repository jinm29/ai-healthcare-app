import {defineConfig} from "@trigger.dev/sdk/v3";
import {aptGet} from "@trigger.dev/build/extensions/core";

export default defineConfig({
    project: process.env.TRIGGER_PROJECT_ID as string,
    runtime: "node",
    logLevel: "log",
    maxDuration: 3600,
    retries: {
        enabledInDev: true,
        default: {
            maxAttempts: 3,
            minTimeoutInMs: 1000,
            maxTimeoutInMs: 10000,
            factor: 2,
            randomize: true,
        },
    },
    build: {
        extensions: [
            aptGet({packages: ["ghostscript", "graphicsmagick"]})
        ]
    },
    dirs: ["./src/trigger"],
});
