import { compare, hash } from "bcryptjs";
import { RequestHandler, Response, Router } from "express";

import type { RKMappedRecord, RKRecord } from "./utils/types";
import type { Bookmark, HelpfulMark, UserGender, UserUsername } from "database/schemas/types";

import { bcrypt_config } from "configs";
import {
  deleteBookmark,
  deleteHelpfulMark,
  deleteUser,
  insertBookmark,
  insertHelpfulMark,
  insertUser,
  selectBookmarksByUsername,
  selectPasswordHashByUsername,
  selectUserAsUser,
  selectUserByUsername,
  updateUserProfileAsUser
} from "database/schemas";

import { catchNext, checkBodyProperties } from "./utils/helpers";

const users_router = Router();

// ---------------- //
// *--- /users ---* //
// ---------------- //

// *--- Types ---* //

/**
 * Keys belonging to @type {Required} Properties of @see PasswordBody
 */
const rk_password_body = <const>["password"];

/**
 * Plain text password
 */
type PasswordBody = RKRecord<typeof rk_password_body>;

/**
 * Keys belonging to @type {Required} Properties of @see LoginBody
 */
export const rk_authenticate_body = <const>["username", ...rk_password_body];

export type AuthenticateBody = RKRecord<typeof rk_authenticate_body>;

// *---- Helpers ---* //

export const resInvalidUsername = (res: Response) => res.status(404).send("Invalid username");

export const resInvalidPassword = (res: Response, code: 401 | 403) =>
  res.status(code).send("Invalid password");

const salted_hash = (password: string) => hash(password, bcrypt_config.salt);

// *--- Routes ---* //

users_router.post<any, any, any, AuthenticateBody>(
  "/login",
  checkBodyProperties(rk_authenticate_body),
  ({ body }, res, next) =>
    catchNext(async () => {
      const { username, password } = body;

      const password_hash_result = await selectPasswordHashByUsername(username);
      if (!password_hash_result[0]) return resInvalidUsername(res);

      const password_hash = password_hash_result[0].password_hash;
      if (await compare(password, password_hash)) return res.sendStatus(200);
      resInvalidPassword(res, 401);
    }, next)
);

/**
 * Keys belonging to @type {Required} Properties of @see PostUserBody
 */
const rk_post_user_body = <const>["email", "last_name", ...rk_authenticate_body];

export interface PostUserBody extends RKRecord<typeof rk_post_user_body> {
  mobile_number?: string;
  address?: string;
  first_name?: string;
  gender: string;
}

export const user_genders: readonly UserGender[] = <const>["F", "M", "O", "N"];

const userGender = (gender: string | undefined) =>
  user_genders.includes(<UserGender>gender) ? <UserGender>gender : "N";

users_router.post<any, any, any, PostUserBody>(
  "/",
  checkBodyProperties(rk_post_user_body),
  ({ body }, res, next) =>
    catchNext(async () => {
      const { username, password, mobile_number, address, email, first_name, last_name, gender } =
        body;
      const password_hash = await salted_hash(password);

      await insertUser({
        username,
        password_hash,
        mobile_number,
        address,
        email,
        first_name,
        last_name,
        gender: userGender(gender),
        created_timestamp: new Date()
      });

      res.sendStatus(201);
    }, next)
);

// -------------------- //
// * /users/:username * //
// -------------------- //

// *--- Types ---* //

interface UsernameParams {
  username: UserUsername;
}

interface AuthenticatedLocals {
  authenticated?: boolean;
}

// *--- Helpers ---* //

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

/**
 * End the request if res.locals.authentcated is falsy;
 * Is synchronous - no extra error handling is needed
 *
 * @param res - @see resInvalidPassword called if unauthenticated
 * @param next - called if authenticated
 * @see authenticate
 */
const rejectUnauthenticated: RequestHandler<any, any, any, any, AuthenticatedLocals> = (
  _,
  res,
  next
) => (res.locals.authenticated ? next() : resInvalidPassword(res, 403));

// *--- Routes ---* //

users_router.use("/:username", authenticate);

users_router.get<UsernameParams, any, any, any, AuthenticatedLocals>(
  "/:username",
  ({ params }, res, next) =>
    catchNext(async () => {
      const { username } = params;
      const user_profile_result = await (res.locals.authenticated
        ? selectUserAsUser(username)
        : selectUserByUsername(username));
      const user_profile = user_profile_result[0];
      if (!user_profile) throw Error("Missing user");
      res.json(user_profile);
    }, next)
);

/**
 * Keys belonging to @type {NonNullable} Properties of @see PatchUserBody
 */
const nn_patch_user_body = <const>["username", "new_password", "email", "last_name"];

type PatchUserBody<T = PostUserBody & RKRecord<typeof nn_patch_user_body>> = {
  [K in keyof Required<T>]?: T[K] extends Required<T>[K] ? T[K] : T[K] | null;
};

users_router.patch<UsernameParams, any, PatchUserBody>(
  "/:username",
  rejectUnauthenticated,
  checkBodyProperties(nn_patch_user_body, [null, ""], (key) => `Invalid ${key}`),
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

      await updateUserProfileAsUser(params.username, {
        username,
        password_hash,
        mobile_number,
        address,
        email,
        first_name,
        last_name,
        gender: userGender(gender)
      });

      res.sendStatus(205);
    }, next)
);

users_router.delete("/:username", rejectUnauthenticated, ({ params }, res, next) =>
  catchNext(async () => {
    await deleteUser(params.username);
    res.sendStatus(204);
  }, next)
);

users_router.use("/:username/:controller", rejectUnauthenticated);

// ------------------------------ //
// * /users/:username/bookmarks * //
// ------------------------------ //

// *--- Types ---* //

const rk_restaurant_id_body = <const>["restaurant_id"];

type RestaurantIDBody = RKMappedRecord<Bookmark, typeof rk_restaurant_id_body>;

// *--- Routes ---* //

users_router.post<UsernameParams, any, RestaurantIDBody>(
  "/:username/bookmarks",
  checkBodyProperties(rk_restaurant_id_body),
  ({ body, params }, res, next) =>
    catchNext(async () => {
      try {
        await insertBookmark({
          username: params.username,
          restaurant_id: body.restaurant_id,
          timestamp: new Date()
        });
      } catch (_) {
        return res.status(403).send("Restaurant already bookmarked");
      }
      res.sendStatus(201);
    }, next)
);

users_router.get("/:username/bookmarks", ({ params }, res, next) =>
  catchNext(async () => res.json(await selectBookmarksByUsername(params.username)), next)
);

users_router.delete<UsernameParams, any, RestaurantIDBody>(
  "/:username/bookmarks",
  checkBodyProperties(rk_restaurant_id_body),
  ({ body, params }, res, next) =>
    catchNext(async () => {
      await deleteBookmark(params.username, body.restaurant_id);
      res.sendStatus(204);
    }, next)
);

// ------------------------------ //
// * /reviews/:id/helpful-marks * //
// ------------------------------ //

// *--- Types ---* //

const rk_review_id_body = <const>["review_id"];

type ReviewIDBody = RKMappedRecord<HelpfulMark, typeof rk_review_id_body>;

// *--- Routes ---* //

users_router.post<UsernameParams, any, ReviewIDBody>(
  "/:username/helpful-marks",
  checkBodyProperties(rk_review_id_body),
  ({ body, params }, res, next) =>
    catchNext(async () => {
      try {
        await insertHelpfulMark({ review_id: body.review_id, username: params.username });
      } catch (_) {
        return res.status(403).send("Review already marked as helpful");
      }
      res.sendStatus(201);
    }, next)
);

users_router.delete<UsernameParams, any, ReviewIDBody>(
  "/:username/helpful-marks",
  checkBodyProperties(rk_review_id_body),
  ({ body, params }, res, next) =>
    catchNext(async () => {
      await deleteHelpfulMark({ review_id: body.review_id, username: params.username });
      res.sendStatus(204);
    }, next)
);

export default users_router;
