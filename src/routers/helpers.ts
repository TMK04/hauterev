import type { NextFunction, RequestHandler } from "express";

export const catchNext = <T>(fn: () => Promise<T>, next: NextFunction) => fn().catch(next);

export const checkBodyProperties =
  (keys: readonly string[]): RequestHandler =>
  ({ body }, res, next) => {
    for (const key of keys) {
      if (!body[key]) return res.status(400).send(`No ${key} provided.`);
    }
    next();
  };
