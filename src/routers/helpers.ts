import type { NextFunction, RequestHandler } from "express";

export const catchNext = <T>(fn: () => Promise<T>, next: NextFunction) => fn().catch(next);

export const checkBodyProperties =
  (
    keys: readonly string[],
    bad_values: any[] = [undefined, null, ""],
    messageFn = (key: string) => `${key} required`
  ): RequestHandler<any, any, any, any> =>
  ({ body }, res, next) => {
    if (!Object.keys(body).length) return res.status(400).send("Invalid body");
    for (const key of keys) {
      if (bad_values.includes(body[key])) return res.status(400).send(messageFn(key));
    }
    next();
  };
