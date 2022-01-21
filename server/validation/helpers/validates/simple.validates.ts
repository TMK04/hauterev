import { numberValidateCallback, stringValidateCallback } from "validation/utils/callbacks";
import validate from "validation/utils/validate";

import { nullInvalid, rawDefaultInvalid } from "./wrappers.validates";

export const stringValidate = <T extends object>(data: T, key: keyof T) =>
  validate(data, key, stringValidateCallback);

export const stringRawDefaultInvalid = <T extends object>(body: T, key: keyof T) =>
  rawDefaultInvalid(body, key, stringValidateCallback);

export const stringNullInvalid = <T extends object>(query: T, key: keyof T) =>
  nullInvalid(query, key, stringValidateCallback);

export const numberValidate = <T extends object>(data: T, key: keyof T) =>
  validate(data, key, numberValidateCallback);

export const numberNullInvalid = <T extends object>(query: T, key: keyof T) =>
  nullInvalid(query, key, numberValidateCallback);
