import { NextFunction, Router } from "express";

import type { NoFalsy } from "./types";

import raw_default from "database/raw-default";

import { InvalidError } from "./Errors";

export const mergeRouter = () => Router({ mergeParams: true });

export const catchNext = <T>(fn: () => Promise<T>, next: NextFunction) => fn().catch(next);

export const validate = <T extends object, R>(
  body: T,
  key: keyof T,
  validateFn: (value: unknown) => R
) => {
  const value = validateFn(body[key]);
  if (value) return <NoFalsy<R>>value;

  throw new InvalidError(key.toString());
};

export const defaultInvalid = <T extends object, R>(
  body: T,
  key: keyof T,
  validateFn: (value: unknown) => R
) => {
  const value = validateFn(body[key]);
  return value ? <NoFalsy<R>>value : raw_default;
};

const simpleStringValidateFn = (v: unknown) => typeof v === "string" && v;

export const simpleStringValidate = <T extends object>(body: T, key: keyof T) =>
  validate(body, key, simpleStringValidateFn);

export const simpleStringNullInvalid = <T extends object>(body: T, key: keyof T) =>
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
