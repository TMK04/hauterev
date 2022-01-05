import type { AuthenticatedLocals, PatchUserBody, UsernameParams } from "./types";

import {
  deleteUserByUsername,
  selectUserAsUser,
  selectUserByUsername,
  UpdateUser,
  updateUserByUsername
} from "database/schemas";
import { InvalidError, NotFoundError } from "routers/utils/Errors";
import {
  catchNext,
  isDefined,
  isEmpty,
  simpleStringDefaultInvalid,
  simpleStringValidate,
  validate
} from "routers/utils/helpers";

import {
  authenticate,
  defaultInvalidGender,
  defaultInvalidMobileNumber,
  rejectUnauthenticated,
  salted_hash,
  validateUsername
} from "./helpers";
import users_router from "./router";

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
        update_user.first_name = simpleStringDefaultInvalid(body, "first_name");
      if (isDefined(mobile_number)) update_user.mobile_number = defaultInvalidMobileNumber(body);
      if (isDefined(address)) update_user.address = simpleStringDefaultInvalid(body, "address");
      if (isDefined(gender)) update_user.gender = defaultInvalidGender(body);

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
