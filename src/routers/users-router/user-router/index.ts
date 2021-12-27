import { compare } from "bcryptjs";
import { RequestHandler, Router } from "express";

import type { PasswordBody, PostUserBody } from "../types";
import type { UserUsername } from "database/schemas/types";
import type { UnknownRecord } from "routers/utils/types";

import {
  nullInvalidGender,
  nullInvalidMobileNumber,
  salted_hash,
  validateUsername
} from "../helpers";
import {
  deleteBookmarkByRestaurantIDnUsername,
  deleteHelpfulMark,
  deleteUserByUsername,
  insertBookmark,
  insertHelpfulMark,
  selectBookmarksByUsername,
  selectPasswordHashByUsername,
  selectUserAsUser,
  selectUserByUsername,
  UpdateUser,
  updateUserByUsername
} from "database/schemas";
import {
  InvalidError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError
} from "routers/utils/Errors";
import {
  catchNext,
  isDefined,
  isEmpty,
  simpleNumberValidate,
  simpleStringNullInvalid,
  simpleStringValidate,
  validate
} from "routers/utils/helpers";

const user_router = Router({ mergeParams: true });

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

user_router.use(authenticate);

user_router.get<UsernameParams, any, any, any, AuthenticatedLocals>("/", ({ params }, res, next) =>
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

type PatchUserBody = Omit<PostUserBody, "password" | "created_timestamp"> &
  UnknownRecord<"new_password">;

user_router.patch<UsernameParams, any, PatchUserBody>(
  "/",
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

      await updateUserByUsername(params.username, update_user);
      res.sendStatus(205);
    }, next)
);

user_router.delete("/", rejectUnauthenticated, ({ params }, res, next) =>
  catchNext(async () => {
    await deleteUserByUsername(params.username);
    res.sendStatus(204);
  }, next)
);

user_router.use("/:controller", rejectUnauthenticated);

// ------------------------------ //
// * /users/:username/bookmarks * //
// ------------------------------ //

// *--- Types ---* //

type RestaurantIDBody = UnknownRecord<"restaurant_id">;

// *--- Routes ---* //

user_router.post<UsernameParams, any, RestaurantIDBody>(
  "/bookmarks",
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

user_router.get<UsernameParams>("/bookmarks", ({ params }, res, next) =>
  catchNext(async () => res.json(await selectBookmarksByUsername(params.username)), next)
);

user_router.delete<UsernameParams, any, RestaurantIDBody>(
  "/bookmarks",
  ({ body, params }, res, next) =>
    catchNext(async () => {
      const restaurant_id = simpleNumberValidate(body, "restaurant_id");
      await deleteBookmarkByRestaurantIDnUsername(restaurant_id, params.username);
      res.sendStatus(204);
    }, next)
);

// ------------------------------ //
// * /reviews/:id/helpful-marks * //
// ------------------------------ //

// *--- Types ---* //

type ReviewIDBody = UnknownRecord<"review_id">;

// *--- Routes ---* //

user_router.post<UsernameParams, any, ReviewIDBody>(
  "/helpful-marks",
  ({ body, params }, res, next) =>
    catchNext(async () => {
      const review_id = simpleNumberValidate(body, "review_id");
      await insertHelpfulMark({ review_id, username: params.username }).catch(() => {
        throw new UnauthorizedError("Review already marked as helpful");
      });
      res.sendStatus(201);
    }, next)
);

user_router.delete<UsernameParams, any, ReviewIDBody>(
  "/helpful-marks",
  ({ body, params }, res, next) =>
    catchNext(async () => {
      const review_id = simpleNumberValidate(body, "review_id");
      await deleteHelpfulMark({ review_id, username: params.username });
      res.sendStatus(204);
    }, next)
);

export default user_router;
