import type { PostUserBody } from "../types";
import type { AuthenticatedLocals, UsernameParams } from "./types";
import type { UnknownRecord } from "routers/utils/types";

import {
  nullInvalidGender,
  nullInvalidMobileNumber,
  salted_hash,
  validateUsername
} from "../helpers";
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
  mergeRouter,
  simpleStringNullInvalid,
  simpleStringValidate,
  validate
} from "routers/utils/helpers";

import bookmarks_router from "./bookmarks-router";
import { authenticate, rejectUnauthenticated } from "./helpers";
import helpful_marks_router from "./helpful-marks-router";

const user_router = mergeRouter();

// ----- //
// * / * //
// ----- //

user_router.use(authenticate);

// *--- GET ---* //

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

// *--- PATCH ---* //

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

// *--- DELETE ---* //

user_router.delete("/", rejectUnauthenticated, ({ params }, res, next) =>
  catchNext(async () => {
    await deleteUserByUsername(params.username);
    res.sendStatus(204);
  }, next)
);

// ---------------- //
// * /:controller * //
// ---------------- //

user_router
  .use("/:controller", rejectUnauthenticated)
  .use("/bookmarks", bookmarks_router)
  .use("/helpful-marks", helpful_marks_router);

export default user_router;
