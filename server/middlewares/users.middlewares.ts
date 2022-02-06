import { verify } from "jsonwebtoken";

import type { RequestHandler } from "express";
import type { AuthenticatedLocals, UsernameParams } from "types";

import { UnauthenticatedError } from "Errors";
import { jwt_config } from "configs";
import { catchNext } from "helpers";

/**
 * Check if provided password matches user password,
 * or end the request if no such user exists
 */
export const authenticate: RequestHandler<UsernameParams, any, any, any, AuthenticatedLocals> = (
  { headers, params },
  res,
  next
) =>
  catchNext(async () => {
    const authorization = headers["authorization"];
    const token = authorization && authorization.split(" ")[1];
    if (!token) return next();

    verify(token, jwt_config.access_token_secret, (err, user) => {
      if (!err && (<Record<"username", string>>user).username === params.username)
        res.locals.authenticated = true;
      next();
    });
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
