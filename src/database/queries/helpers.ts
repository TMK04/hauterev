import type { Data, Raw } from "./types";

import db from "database";

export const filter = <T extends Data>(data: T): Raw<T> => {
  const filtered = <Raw<T>>data;
  for (const key in filtered) {
    if (data[key] === undefined) delete filtered[key];
    if (data[key] === null) filtered[key] = db.raw("DEFAULT");
  }
  return filtered;
};

export const notEmpty = (data: Data) => {
  for (const key in data) {
    if (data[key] !== undefined) return true;
  }
  return false;
};
