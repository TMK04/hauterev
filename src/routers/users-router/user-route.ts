import { compare } from "bcryptjs";
import { RequestHandler } from "express";

import type { Optional, RKRecord } from "types";

import {
  updateUserProfileAsUser,
  selectPasswordHashByUsername,
  selectUserProfileAsUser,
  selectUserProfileByUsername
} from "database/queries";
import { userGender, UserUsername } from "database/schemas";
import { salted_hash } from "helpers";
import { catchNext, checkBodyProperties } from "routers/helpers";

import users_router, { PasswordBody, PostUserBody } from "./router";

const user_path = "/:username";

interface UsernameParams {
  username: UserUsername;
}

interface AuthenticatedLocals {
  authenticated?: boolean;
}

/**
 * Check if provided password matches user password,
 * or end the request if no such user exists
 */
const authenticate: RequestHandler<
  UsernameParams,
  any,
  Optional<PasswordBody>,
  any,
  AuthenticatedLocals
> = ({ body, params }, res, next) =>
  catchNext(async () => {
    if (!body.password) return next();
    const { password } = body;
    delete body.password;

    const password_hash_result = await selectPasswordHashByUsername(params.username);
    if (!password_hash_result.length) return res.status(404).send("User not found");

    const password_hash = password_hash_result[0].password_hash;
    res.locals.authenticated = await compare(password, password_hash);
    next();
  }, next);

users_router.use(user_path, authenticate);

const user_route = users_router.route(user_path);

user_route.get<UsernameParams, any, any, any, AuthenticatedLocals>(({ params }, res, next) =>
  catchNext(async () => {
    const { username } = params;
    const user_profile_result = await (res.locals.authenticated
      ? selectUserProfileAsUser(username)
      : selectUserProfileByUsername(username));
    const user_profile = user_profile_result[0];
    res.json(user_profile);
  }, next)
);

/**
 * End the request if res.locals.authentcated is falsy;
 * Is synchronous - no extra error handling is needed
 *
 * @param res - sendStatus(403) called if unauthenticated
 * @param next - called if authenticated
 * @see authenticate
 */
const rejectUnauthenticated: RequestHandler<any, any, any, any, AuthenticatedLocals> = (
  _,
  res,
  next
) => (res.locals.authenticated ? next() : res.status(403).send("Invalid password"));

const rk_patch_user_body = <const>["username", "new_password", "email", "last_name"];

interface IPatchUserBody extends PostUserBody, RKRecord<typeof rk_patch_user_body> {
  new_password: string;
}

type PatchUserBody = {
  [K in keyof Required<IPatchUserBody>]?: IPatchUserBody[K] extends Required<IPatchUserBody>[K]
    ? IPatchUserBody[K]
    : IPatchUserBody[K] | null;
};

user_route.patch<UsernameParams, any, PatchUserBody>(
  rejectUnauthenticated,
  checkBodyProperties(rk_patch_user_body, [null], (key) => `${key} must not be null`),
  ({ body, params }, res, next) =>
    catchNext(async () => {
      const {
        username,
        new_password,
        mobile_number,
        address,
        email,
        first_name,
        last_name,
        gender
      } = body;
      const password_hash = new_password && (await salted_hash(new_password));

      await updateUserProfileAsUser(
        params.username,
        {
          username,
          password_hash,
          mobile_number,
          address
        },
        { email, first_name, last_name, gender: <undefined>gender && userGender(gender) }
      );

      res.sendStatus(205);
    }, next)
);
