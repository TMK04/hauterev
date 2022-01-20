import type { ExpressConfig } from "./types";

import getEnvVar from "./getEnvVar";

const express_config: ExpressConfig = {
  port: +getEnvVar("PORT"),
  hostname: getEnvVar("HOSTNAME")
};

export default express_config;
