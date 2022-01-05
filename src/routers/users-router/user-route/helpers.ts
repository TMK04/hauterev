import { compare } from "bcryptjs";

import type { PasswordBody } from "../types";
import type { AuthenticatedLocals, UsernameParams } from "./types";
import type { RequestHandler } from "express";

import { selectPasswordHashByUsername } from "database/queries";
import { NotFoundError, UnauthenticatedError } from "routers/utils/Errors";
import { catchNext, simpleStringValidate } from "routers/utils/helpers";

// -------- //
// * auth * //
// -------- //

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
    const { username } = params;
    const password_hash_result = await selectPasswordHashByUsername(username);
    if (!password_hash_result[0]) throw new NotFoundError("User", username);

    try {
      const password = simpleStringValidate(body, "password");
      const password_hash = password_hash_result[0].password_hash;
      res.locals.authenticated = await compare(password, password_hash);
    } catch (_) {
      _;
    } finally {
      next();
    }
  }, next);

/**
 * End the request if res.locals.authentcated is falsy;
 * Is synchronous - no extra error handling is needed
 *
 * @param res - @see resInvalidPassword called if unauthenticated
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
