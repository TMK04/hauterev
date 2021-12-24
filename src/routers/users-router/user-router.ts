import { compare } from "bcryptjs";
import { RequestHandler, Router } from "express";

import type { RKRecord } from "routers/types";

import {
  updateUserProfileAsUser,
  selectPasswordHashByUsername,
  selectUserProfileAsUser,
  selectUserProfileByUsername,
  deleteUser
} from "database/queries";
import { userGender, UserUsername } from "database/schemas";
import { salted_hash } from "helpers";
import { catchNext, checkBodyProperties } from "routers/helpers";

import { PasswordBody, PostUserBody, resInvalidPassword, resInvalidUsername } from ".";

const user_router = Router({ mergeParams: true });

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
  Partial<PasswordBody>,
  any,
  AuthenticatedLocals
> = ({ body, params }, res, next) =>
  catchNext(async () => {
    const password_hash_result = await selectPasswordHashByUsername(params.username);
    if (!password_hash_result[0]) return resInvalidUsername(res);

    if (!body.password) return next();
    const { password } = body;
    delete body.password;

    const password_hash = password_hash_result[0].password_hash;
    res.locals.authenticated = await compare(password, password_hash);
    next();
  }, next);

user_router.use(authenticate);

const route = user_router.route("/");

route.get<UsernameParams, any, any, any, AuthenticatedLocals>(({ params }, res, next) =>
  catchNext(async () => {
    const { username } = params;
    const user_profile_result = await (res.locals.authenticated
      ? selectUserProfileAsUser(username)
      : selectUserProfileByUsername(username));
    const user_profile = user_profile_result[0];
    if (!user_profile) throw Error("Missing user");
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
) => (res.locals.authenticated ? next() : resInvalidPassword(res, 403));

const rk_patch_user_body = <const>["username", "new_password", "email", "last_name"];

interface IPatchUserBody extends PostUserBody, RKRecord<typeof rk_patch_user_body> {
  new_password: string;
}

type PatchUserBody = {
  [K in keyof Required<IPatchUserBody>]?: IPatchUserBody[K] extends Required<IPatchUserBody>[K]
    ? IPatchUserBody[K]
    : IPatchUserBody[K] | null;
};

route.patch<UsernameParams, any, PatchUserBody>(
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

route.delete<UsernameParams>(rejectUnauthenticated, ({ params }, res, next) =>
  catchNext(async () => {
    await deleteUser(params.username);
    res.sendStatus(204);
  }, next)
);

export default user_router;
