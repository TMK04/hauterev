import { hash } from "bcryptjs";
import { Router } from "express";

import type { RKRecord } from "types";

import { bcrypt_config } from "configs";
import { registerUser } from "database/queries";
import { userGender } from "database/schemas";
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
  gender?: string;
}

users_router.post("/", checkBodyProperties(rk_post_user_body), ({ body }, res, next) =>
  catchNext(async () => {
    const { username, password, mobile_number, address, email, first_name, last_name, gender } = <
      PostUserBody
    >body;

    const password_hash = await hash(password, bcrypt_config.salt_rounds);

    try {
      await registerUser({
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
      return res.status(403).send("Username taken.");
    }

    res.sendStatus(201);
  }, next)
);

export default users_router;
