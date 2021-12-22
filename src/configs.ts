import type { Knex } from "knex";

const getEnvVar = (var_key: string) => <string>process.env[var_key];

interface ExpressConfig {
  port: number;
  hostname: string;
}

export const express_config: ExpressConfig = {
  port: +getEnvVar("PORT"),
  hostname: getEnvVar("HOSTNAME")
};

export const mysql_config: Knex.MySql2ConnectionConfig = {
  host: getEnvVar("SQL_HOST"),
  port: +getEnvVar("SQL_PORT"),
  user: getEnvVar("SQL_USER"),
  password: getEnvVar("SQL_PASSWORD"),
  database: getEnvVar("SQL_DATABASE")
};

interface BcryptConfig {
  salt_rounds: number;
}

export const bcrypt_config: BcryptConfig = {
  salt_rounds: +getEnvVar("BCRYPT_SALT_ROUNDS")
};
