import type { DBConfig } from "./types";

import getEnvVar from "./getEnvVar";

const db_config: DBConfig = {
  host: getEnvVar("SQL_HOST"),
  port: +getEnvVar("SQL_PORT"),
  user: getEnvVar("SQL_USER"),
  password: getEnvVar("SQL_PASSWORD"),
  database: getEnvVar("SQL_DATABASE")
};

export default db_config;
