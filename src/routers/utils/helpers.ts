import { NextFunction } from "express";

import type { NoFalsy } from "./types";

import raw_default from "database/raw-default";

import { InvalidError } from "./Errors";

export const catchNext = <T>(fn: () => Promise<T>, next: NextFunction) => fn().catch(next);

// ----------------------- //
// * validate & variants * //
// ----------------------- //

export function validate<T extends object, R>(
  data: T,
  key: keyof T,
  validateFn: (value: T[keyof T]) => R,
  default_invalid?: false
): NoFalsy<R>;
export function validate<T extends object, R, D>(
  data: T,
  key: keyof T,
  validateFn: (value: T[keyof T]) => R,
  default_invalid: true,
  default_value: D
): NoFalsy<R> | D;
export function validate<T extends object, R, D>(
  data: T,
  key: keyof T,
  validateFn: (value: T[keyof T]) => R,
  default_invalid = false,
  default_value?: D
) {
  const value = validateFn(data[key]);
  if (value) return <NoFalsy<R>>value;

  if (default_invalid) return default_value;
  throw new InvalidError(key.toString());
}

export const defaultInvalid = <T extends object, R, D>(
  data: T,
  key: keyof T,
  validateFn: (value: T[keyof T]) => R,
  default_value: D
) => validate(data, key, validateFn, true, default_value);

export const rawDefaultInvalid = <T extends object, R>(
  body: T,
  key: keyof T,
  validateFn: (value: T[keyof T]) => R
) => defaultInvalid(body, key, validateFn, raw_default);

export const nullInvalid = <T extends object, R>(
  query: T,
  key: keyof T,
  validateFn: (value: T[keyof T]) => R
) => defaultInvalid(query, key, validateFn, null);

const simpleStringValidateFn = <T>(v: T) => typeof v === "string" && v;

export const simpleStringValidate = <T extends object>(data: T, key: keyof T) =>
  validate(data, key, simpleStringValidateFn);

export const simpleStringRawDefaultInvalid = <T extends object>(body: T, key: keyof T) =>
  rawDefaultInvalid(body, key, simpleStringValidateFn);

const simpleNumberValidateFn = <T>(v: T) => typeof v === "number" && v;

export const simpleNumberValidate = <T extends object>(data: T, key: keyof T) =>
  validate(data, key, simpleNumberValidateFn);

// ---------- //
// * Checks * //
// ---------- //

export const isDefined = (value: unknown) => typeof value !== "undefined";

export const isEmpty = <T extends object>(data: Partial<T>) => {
  for (const key in data) {
    if (data[key]) return false;
  }
  return true;
};
