import { config } from "dotenv-safe";

// Initialize environment variables.
config();

const getEnvVar = (var_key: string) => <string>process.env[var_key];

interface ExpressConfig {
  port: number;
  hostname: string;
}

export const express_config: ExpressConfig = {
  port: +getEnvVar("PORT"),
  hostname: getEnvVar("HOSTNAME")
};
