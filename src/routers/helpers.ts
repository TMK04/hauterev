import { compare } from "bcryptjs";

import type { AuthenticateBody } from "./users-router";
import type { NextFunction, RequestHandler, Response } from "express";

import { selectPasswordHashByUsername } from "database/queries";

export const catchNext = <T>(fn: () => Promise<T>, next: NextFunction) => fn().catch(next);

export const resInvalidUsername = (res: Response) => res.status(404).send("Invalid username");

export const resInvalidPassword = (res: Response, code: 401 | 403) =>
  res.status(code).send("Invalid password");

export const rejectUnauthenticated: RequestHandler<any, any, Partial<AuthenticateBody>> = (
  { body },
  res,
  next
) =>
  catchNext(async () => {
    if (!body.username) return resInvalidUsername(res);
    if (!body.password) return resInvalidPassword(res, 403);
    const { username, password } = body;
    delete body.password;

    const password_hash_result = await selectPasswordHashByUsername(username);
    if (!password_hash_result[0]) return resInvalidUsername(res);

    const password_hash = password_hash_result[0].password_hash;
    if (await compare(password, password_hash)) return next();
    resInvalidPassword(res, 403);
  }, next);

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
