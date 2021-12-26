import type { NextFunction, RequestHandler } from "express";

import { InvalidError } from "./Errors";

export const catchNext = <T>(fn: () => Promise<T>, next: NextFunction) => fn().catch(next);

export const checkBodyProperties =
  (
    keys: readonly string[],
    bad_values: any[] = [undefined, null, ""],
    messageFn = (key: string) => `${key} required`
  ): RequestHandler<any, any, any, any> =>
  ({ body }, _, next) => {
    if (!Object.keys(body).length) return next(new InvalidError("body"));
    for (const key of keys) {
      if (bad_values.includes(body[key])) return next(new InvalidError(messageFn(key)));
    }
    next();
  };
