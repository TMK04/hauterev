import { compare, hash } from "bcryptjs";

import type { AuthenticatedLocals, PasswordBody, UsernameBody, UsernameParams } from "./types";
import type { UserGender } from "database/queries/types";
import type { RequestHandler } from "express";
import type { UnknownRecord } from "routers/utils/types";

import { bcrypt_config } from "configs";
import { selectPasswordHashByUsername } from "database/queries";
import { NotFoundError, UnauthenticatedError } from "routers/utils/Errors";
import {
  catchNext,
  rawDefaultInvalid,
  simpleStringValidate,
  validate
} from "routers/utils/helpers";

export const salted_hash = (password: string) => hash(password, bcrypt_config.salt);

// ---------------------------- //
// * validate Implementations * //
// ---------------------------- //

export const validateUsername = <T extends UsernameBody>(body: T) =>
  validate(body, "username", (v) => {
    if (typeof v !== "string" || v.match(/\W/)) return;
    if (v.length < 20) return v;
  });

export const validatePassword = <T extends UnknownRecord<A>, A extends string>(
  body: T,
  alias: A = <A>"password"
) =>
  validate(body, alias, (v) => {
    if (typeof v !== "string" || v.match(/\s/)) return;
    const { length } = v;
    if (length > 8 && length < 50) return v;
  });

export const rawDefaultInvalidMobileNumber = <T extends UnknownRecord<"mobile_number">>(body: T) =>
  rawDefaultInvalid(
    body,
    "mobile_number",
    (v) => (typeof v === "number" || typeof v === "string") && v.toString()
  );

const user_genders: readonly UserGender[] = <const>["F", "M", "O", "N"];

export const rawDefaultInvalidGender = <T extends UnknownRecord<"gender">>(body: T) =>
  rawDefaultInvalid(body, "gender", (v: any) => user_genders.includes(v) && <UserGender>v);

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
