import { NextFunction, Router } from "express";

import type { NoFalsy } from "./types";
import type { RawDefault } from "database/schemas/types";

import raw_default from "database/raw-default";

import { InvalidError } from "./Errors";

export const mergeRouter = () => Router({ mergeParams: true });

export const catchNext = <T>(fn: () => Promise<T>, next: NextFunction) => fn().catch(next);

export function validate<T extends object, R>(
  body: T,
  key: keyof T,
  validateFn: (value: unknown) => R,
  defaultInvalid?: false
): NoFalsy<R>;
export function validate<T extends object, R>(
  body: T,
  key: keyof T,
  validateFn: (value: unknown) => R,
  defaultInvalid: true
): NoFalsy<R> | RawDefault;
export function validate<T extends object, R>(
  body: T,
  key: keyof T,
  validateFn: (value: unknown) => R,
  defaultInvalid = false
) {
  const value = validateFn(body[key]);
  if (value) return <NoFalsy<R>>value;

  if (defaultInvalid) return raw_default;
  throw new InvalidError(key.toString());
}

export const defaultInvalid = <T extends object, R>(
  body: T,
  key: keyof T,
  validateFn: (value: unknown) => R
) => validate(body, key, validateFn, true);

const simpleStringValidateFn = (v: unknown) => typeof v === "string" && v;

export const simpleStringValidate = <T extends object>(body: T, key: keyof T) =>
  validate(body, key, simpleStringValidateFn);

export const simpleStringDefaultInvalid = <T extends object>(body: T, key: keyof T) =>
  defaultInvalid(body, key, simpleStringValidateFn);

const simpleNumberValidateFn = (v: unknown) => typeof v === "number" && v;

export const simpleNumberValidate = <T extends object>(body: T, key: keyof T) =>
  validate(body, key, simpleNumberValidateFn);

export const isDefined = (value: unknown) => typeof value !== "undefined";

export const isEmpty = <T extends object>(data: Partial<T>) => {
  for (const key in data) {
    if (data[key]) return false;
  }
  return true;
};
