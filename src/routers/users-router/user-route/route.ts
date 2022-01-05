import type { AuthenticatedLocals, PatchUserBody, UsernameParams } from "./types";

import {
  rawDefaultInvalidGender,
  rawDefaultInvalidMobileNumber,
  salted_hash,
  validatePassword,
  validateUsername
} from "../helpers";
import users_router from "../router";
import {
  deleteUserByUsername,
  selectUserAsUser,
  selectUserByUsername,
  UpdateUser,
  updateUserByUsername
} from "database/queries";
import { InvalidError, NotFoundError } from "routers/utils/Errors";
import {
  catchNext,
  isDefined,
  isEmpty,
  simpleStringRawDefaultInvalid,
  simpleStringValidate
} from "routers/utils/helpers";

import { rejectUnauthenticated } from "./helpers";

// -------------------- //
// * /users/:username * //
// -------------------- //

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
