import type { Knex } from "knex";

export type Unpartial<T> = {
  [K in keyof Required<T>]: T[K] extends Required<T>[K]
    ? T[K] | undefined
    : T[K] | null | undefined;
};

export type Data = { [key: string]: unknown };

export type Raw<T> = {
  [K in keyof T]: Knex.Raw<Exclude<T[K], null | undefined>>;
};
