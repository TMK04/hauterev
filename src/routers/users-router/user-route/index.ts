import { compare } from "bcryptjs";

import type { PasswordBody, PostUserBody } from "..";
import type { RequestHandler } from "express";
import type { ParamsRecord, UnknownRecord } from "routers/types";

import users_router, {
  rawDefaultInvalidGender,
  rawDefaultInvalidMobileNumber,
  salted_hash,
  validatePassword,
  validateUsername
} from "..";
import {
  deleteUserByUsername,
  selectPasswordHashByUsername,
  selectUserAsUser,
  selectUserByUsername,
  UpdateUser,
  updateUserByUsername
} from "database/queries";
import { InvalidError, NotFoundError, UnauthenticatedError } from "routers/Errors";
import {
  catchNext,
  isDefined,
  isEmpty,
  simpleStringRawDefaultInvalid,
  simpleStringValidate
} from "routers/helpers";

// --------- //
// * Types * //
// --------- //

export type UsernameParams = ParamsRecord<"username">;

export type AuthenticatedLocals = Partial<Record<"authenticated", boolean>>;

type PatchUserBody = Omit<PostUserBody, "password" | "created_timestamp"> &
  UnknownRecord<"new_password">;

// ----------- //
// * Helpers * //
// ----------- //

// *--- auth ---* //

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

// -------------------- //
// * /users/:username * //
// -------------------- //

users_router.use("/:username", authenticate);

// *--- GET ---* //

users_router.get<UsernameParams, any, any, any, AuthenticatedLocals>(
  "/:username",
  ({ params }, res, next) =>
    catchNext(async () => {
      const { username } = params;
      const user_profile_result = await (res.locals.authenticated
        ? selectUserAsUser(username)
        : selectUserByUsername(username));
      const user_profile = user_profile_result[0];
      if (!user_profile) throw new NotFoundError("User", username);
      res.json(user_profile);
    }, next)
);

// *--- PATCH ---* //

users_router.patch<UsernameParams, any, PatchUserBody>(
  "/:username",
  rejectUnauthenticated,
  ({ body, params }, res, next) =>
    catchNext(async () => {
      const {
        username,
        new_password,
        email,
        last_name,
        first_name,
        mobile_number,
        address,
        gender
      } = body;

      const update_user: UpdateUser = {};
      if (isDefined(username)) update_user.username = validateUsername(body);
      if (isDefined(new_password))
        update_user.password_hash = await salted_hash(validatePassword(body, "new_password"));
      if (isDefined(email)) update_user.email = simpleStringValidate(body, "email");
      if (isDefined(last_name)) update_user.last_name = simpleStringValidate(body, "last_name");
      if (isDefined(first_name))
        update_user.first_name = simpleStringRawDefaultInvalid(body, "first_name");
      if (isDefined(mobile_number)) update_user.mobile_number = rawDefaultInvalidMobileNumber(body);
      if (isDefined(address)) update_user.address = simpleStringRawDefaultInvalid(body, "address");
      if (isDefined(gender)) update_user.gender = rawDefaultInvalidGender(body);

      if (isEmpty(update_user)) throw new InvalidError("body");

      await updateUserByUsername(params.username, update_user);
      res.sendStatus(205);
    }, next)
);

// *--- DELETE ---* //

users_router.delete("/:username", rejectUnauthenticated, ({ params }, res, next) =>
  catchNext(async () => {
    await deleteUserByUsername(params.username);
    res.sendStatus(204);
  }, next)
);

// --------------------------- //
// * /users/:username/:route * //
// --------------------------- //

users_router.use("/:username/:route", rejectUnauthenticated);

import "./reviews-store";
import "./bookmarks-collection";
import "./helpful-marks-collection";
