import { compare, hash } from "bcryptjs";
import { RequestHandler, Router } from "express";

import type { UnknownRecord } from "./utils/types";
import type { UserGender, UserUsername } from "database/schemas/types";

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
  UpdateUser,
  updateUserAsUser
} from "database/schemas";

import {
  InvalidError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError
} from "./utils/Errors";
import {
  catchNext,
  isDefined,
  defaultInvalid,
  simpleNumberValidate,
  simpleStringNullInvalid,
  simpleStringValidate,
  validate,
  isEmpty
} from "./utils/helpers";

const users_router = Router();

// ---------------- //
// *--- /users ---* //
// ---------------- //

// *--- Types ---* //

type UsernameBody = UnknownRecord<"username">;

type PasswordBody = UnknownRecord<"password">;

export type AuthenticateBody = UsernameBody & PasswordBody;

// *---- Helpers ---* //

const salted_hash = (password: string) => hash(password, bcrypt_config.salt);

const validateUsername = <T extends UsernameBody>(body: T) =>
  validate(body, "username", (v) => {
    if (typeof v !== "string" || v.match(/\W/)) return;
    if (v.length < 20) return v;
  });

const validatePassword = <T extends PasswordBody>(body: T) =>
  validate(body, "password", (v) => {
    if (typeof v !== "string") return;
    const { length } = v;
    if (length > 8 && length < 50) return v;
  });

const nullInvalidMobileNumber = <T extends UnknownRecord<"mobile_number">>(body: T) =>
  defaultInvalid(
    body,
    "mobile_number",
    (v) => (typeof v === "number" || typeof v === "string") && v.toString()
  );

const user_genders: readonly UserGender[] = <const>["F", "M", "O", "N"];

const nullInvalidGender = <T extends UnknownRecord<"gender">>(body: T) =>
  defaultInvalid(body, "gender", (v) => user_genders.includes(<UserGender>v) && <UserGender>v);

// *--- Routes ---* //

users_router.post<any, any, any, AuthenticateBody>("/login", ({ body }, res, next) =>
  catchNext(async () => {
    const username = simpleStringValidate(body, "username");
    const password = simpleStringValidate(body, "password");

    const password_hash_result = await selectPasswordHashByUsername(username);
    if (!password_hash_result[0]) throw new NotFoundError("User", username);

    const password_hash = password_hash_result[0].password_hash;
    if (await compare(password, password_hash)) return res.sendStatus(200);

    throw new UnauthenticatedError();
  }, next)
);

export type PostUserBody = AuthenticateBody &
  UnknownRecord<"email" | "last_name" | "first_name" | "mobile_number" | "address" | "gender">;

users_router.post<any, any, any, PostUserBody>("/", ({ body }, res, next) =>
  catchNext(async () => {
    const username = validateUsername(body);
    const password = validatePassword(body);
    const password_hash = await salted_hash(password);
    const email = simpleStringValidate(body, "email");
    const last_name = simpleStringValidate(body, "last_name");
    const first_name = simpleStringNullInvalid(body, "first_name");
    const mobile_number = nullInvalidMobileNumber(body);
    const address = simpleStringNullInvalid(body, "address");
    const gender = nullInvalidGender(body);

    await insertUser({
      username,
      password_hash,
      email,
      last_name,
      first_name,
      mobile_number,
      address,
      gender,
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
const rejectUnauthenticated: RequestHandler<any, any, any, any, AuthenticatedLocals> = (
  _,
  res,
  next
) => {
  if (res.locals.authenticated) return next();
  throw new UnauthenticatedError();
};

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

type PatchUserBody = Omit<PostUserBody, "password" | "created_timestamp"> &
  UnknownRecord<"new_password">;

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
        update_user.password_hash = await salted_hash(
          validate(body, "new_password", (v) => {
            if (typeof v !== "string") return;
            const { length } = v;
            if (length > 8 && length < 50) return v;
          })
        );
      if (isDefined(email)) update_user.email = simpleStringValidate(body, "email");
      if (isDefined(last_name)) update_user.last_name = simpleStringValidate(body, "last_name");
      if (isDefined(first_name))
        update_user.first_name = simpleStringNullInvalid(body, "first_name");
      if (isDefined(mobile_number)) update_user.mobile_number = nullInvalidMobileNumber(body);
      if (isDefined(address)) update_user.address = simpleStringNullInvalid(body, "address");
      if (isDefined(gender)) update_user.gender = nullInvalidGender(body);

      if (isEmpty(update_user)) throw new InvalidError("body");

      await updateUserAsUser(params.username, update_user);
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

type RestaurantIDBody = UnknownRecord<"restaurant_id">;

// *--- Routes ---* //

users_router.post<UsernameParams, any, RestaurantIDBody>(
  "/:username/bookmarks",
  ({ body, params }, res, next) =>
    catchNext(async () => {
      const restaurant_id = simpleNumberValidate(body, "restaurant_id");
      await insertBookmark({
        username: params.username,
        restaurant_id,
        timestamp: new Date()
      }).catch(() => {
        throw new UnauthorizedError("Restaurant already bookmarked");
      });
      res.sendStatus(201);
    }, next)
);

users_router.get("/:username/bookmarks", ({ params }, res, next) =>
  catchNext(async () => res.json(await selectBookmarksByUsername(params.username)), next)
);

users_router.delete<UsernameParams, any, RestaurantIDBody>(
  "/:username/bookmarks",
  ({ body, params }, res, next) =>
    catchNext(async () => {
      const restaurant_id = simpleNumberValidate(body, "restaurant_id");
      await deleteBookmark(params.username, restaurant_id);
      res.sendStatus(204);
    }, next)
);

// ------------------------------ //
// * /reviews/:id/helpful-marks * //
// ------------------------------ //

// *--- Types ---* //

type ReviewIDBody = UnknownRecord<"review_id">;

// *--- Routes ---* //

users_router.post<UsernameParams, any, ReviewIDBody>(
  "/:username/helpful-marks",
  ({ body, params }, res, next) =>
    catchNext(async () => {
      const review_id = simpleNumberValidate(body, "review_id");
      await insertHelpfulMark({ review_id, username: params.username }).catch(() => {
        throw new UnauthorizedError("Review already marked as helpful");
      });
      res.sendStatus(201);
    }, next)
);

users_router.delete<UsernameParams, any, ReviewIDBody>(
  "/:username/helpful-marks",
  ({ body, params }, res, next) =>
    catchNext(async () => {
      const review_id = simpleNumberValidate(body, "review_id");
      await deleteHelpfulMark({ review_id, username: params.username });
      res.sendStatus(204);
    }, next)
);

export default users_router;
