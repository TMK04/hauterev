import type { NoFalsy } from "helpers/types";

import { InvalidError } from "Errors";

function validate<T extends object, R>(
  data: T,
  key: keyof T,
  callback: (value: T[keyof T]) => R,
  default_invalid?: false
): NoFalsy<R>;
function validate<T extends object, R, D>(
  data: T,
  key: keyof T,
  callback: (value: T[keyof T]) => R,
  default_invalid: true,
  default_value: D
): NoFalsy<R> | D;
function validate<T extends object, R, D>(
  data: T,
  key: keyof T,
  callback: (value: T[keyof T]) => R,
  default_invalid = false,
  default_value?: D
) {
  const value = callback(data[key]);
  if (value) return <NoFalsy<R>>value;

  if (default_invalid) return default_value;
  throw new InvalidError(key.toString());
}

export default validate;
