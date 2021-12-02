import type { Knex } from "knex";

import db from "database";

type Raw<T> = {
  [K in keyof T]: Knex.Raw<Exclude<T[K], null | undefined>>;
};

export const filter = <T extends object>(data: T): Raw<T> => {
  const filtered = <Raw<T>>data;
  for (const key in filtered) {
    if (data[key] === undefined) delete filtered[key];
    if (data[key] === null) filtered[key] = db.raw("DEFAULT");
  }
  return filtered;
};

export const notEmpty = <T extends object>(data: T) => {
  for (const key in data) {
    if (data[key] !== undefined) return true;
  }
  return false;
};
