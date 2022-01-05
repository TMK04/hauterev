import { compare } from "bcryptjs";
import { Response, Router } from "express";

import type { RKRecord } from "routers/types";

import { insertUser, selectPasswordHashByUsername } from "database/queries";
import { userGender } from "database/schemas";
import { salted_hash } from "helpers";
import { catchNext, checkBodyProperties } from "routers/helpers";

import user_router from "./user-router";

const users_router = Router();

const rk_password_body = <const>["password"];

/**
 * Plain text password
 */
export type PasswordBody = RKRecord<typeof rk_password_body>;

const rk_login_body = <const>["username", ...rk_password_body];

type LoginBody = RKRecord<typeof rk_login_body>;

export const resInvalidUsername = (res: Response) => res.status(404).send("Invalid username");

export const resInvalidPassword = (res: Response, code: 401 | 403) =>
  res.status(code).send("Invalid password");

users_router.post<any, any, any, LoginBody>(
  "/login",
  checkBodyProperties(rk_login_body, [undefined, null, ""], (key) => `${key} required`),
  ({ body }, res, next) =>
    catchNext(async () => {
      const { username, password } = body;

      const password_hash_result = await selectPasswordHashByUsername(username);
      if (!password_hash_result[0]) return resInvalidUsername(res);

      const password_hash = password_hash_result[0].password_hash;
      if (await compare(password, password_hash)) res.sendStatus(200);
      else resInvalidPassword(res, 401);
    }, next)
);

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

users_router.use("/:username", user_router);

export default users_router;
