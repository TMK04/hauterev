import raw_default from "db/helpers/raw-default";
import castInvalid from "validation/utils/castInvalid";

export const rawDefaultInvalid = <T extends object, R>(
  body: T,
  key: keyof T,
  validateFn: (value: T[keyof T]) => R
) => castInvalid(body, key, validateFn, raw_default);

export const nullInvalid = <T extends object, R>(
  query: T,
  key: keyof T,
  validateFn: (value: T[keyof T]) => R
) => castInvalid(query, key, validateFn, null);
