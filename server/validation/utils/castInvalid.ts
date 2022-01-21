import validate from "./validate";

const castInvalid = <T extends object, R, D>(
  data: T,
  key: keyof T,
  validateFn: (value: T[keyof T]) => R,
  default_value: D
) => validate(data, key, validateFn, true, default_value);

export default castInvalid;
