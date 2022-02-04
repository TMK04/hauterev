import { compare } from "bcryptjs";

import type { RequestHandler } from "express";
import type { AuthenticatedLocals, PasswordBody, UsernameParams } from "types";

import { NotFoundError, UnauthenticatedError } from "Errors";
import { user_db } from "db";
import { catchNext } from "helpers";
import { nullInvalidPasswordBody } from "validation";

/**
 * Check if provided password matches user password,
 * or end the request if no such user exists
 */
export const authenticate: RequestHandler<
  UsernameParams,
  any,
  Partial<PasswordBody>,
  any,
  AuthenticatedLocals
> = ({ body, params }, res, next) =>
  catchNext(async () => {
    const { password } = nullInvalidPasswordBody(body);

    const { username } = params;
    const password_hash_result = await user_db.selectPasswordHashByUsername(username);
    if (!password_hash_result[0]) throw new NotFoundError("User", username);

    const password_hash = password_hash_result[0].password_hash;
    res.locals.authenticated = Boolean(password && (await compare(password, password_hash)));
    next();
  }, next);

/**
 * End the request if res.locals.authentcated is falsy;
 * Is synchronous - no extra error handling is needed
 *
 * @param res - @see UnauthenticatedError thrown if unauthenticated
 * @param next - called if authenticated
 * @see authenticate
 */
export const rejectUnauthenticated: RequestHandler<any, any, any, any, AuthenticatedLocals> = (
  _,
  res,
  next
) => {
  if (res.locals.authenticated) return next();
  throw new UnauthenticatedError();
};
