import { Router } from "express";

import type { RKRecord } from "types";

import { insertUser } from "database/queries";
import { userGender } from "database/schemas";
import { salted_hash } from "helpers";
import { catchNext, checkBodyProperties } from "routers/helpers";

const users_router = Router();

const rk_password_body = <const>["password"];

/**
 * Plain text password
 */
export type PasswordBody = RKRecord<typeof rk_password_body>;

const rk_login_body = <const>["username", ...rk_password_body];

// type LoginBody = RKRecord<typeof rk_login_body>;

const rk_post_user_body = <const>["email", "last_name", ...rk_login_body];

export interface PostUserBody extends RKRecord<typeof rk_post_user_body> {
  mobile_number?: string;
  address?: string;
  first_name?: string;
  gender: string;
}

users_router.post<any, any, any, PostUserBody>(
  "/",
  checkBodyProperties(rk_post_user_body, [undefined, null, ""], (key) => `${key} required`),
  ({ body }, res, next) =>
    catchNext(async () => {
      const { username, password, mobile_number, address, email, first_name, last_name, gender } =
        body;
      const password_hash = await salted_hash(password);

      try {
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
      } catch (_) {
        return res.status(403).send("Username taken");
      }

      res.sendStatus(201);
    }, next)
);

export default users_router;
