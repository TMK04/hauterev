import type { Knex } from "knex";

export interface BcryptConfig {
  salt: number;
}

export type DBConfig = Knex.MySql2ConnectionConfig;

export interface ExpressConfig {
  port: number;
  hostname: string;
}
