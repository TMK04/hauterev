import { compare, hash } from "bcryptjs";
import { Router } from "express";

import type { UserGender } from "database/queries/types";
import type { UnknownRecord } from "routers/types";

import { bcrypt_config } from "configs";
import { insertUser, selectPasswordHashByUsername } from "database/queries";
import { NotFoundError, UnauthenticatedError } from "routers/Errors";
import {
  catchNext,
  rawDefaultInvalid,
  simpleStringRawDefaultInvalid,
  simpleStringValidate,
  validate
} from "routers/helpers";

const users_router = Router();

// --------- //
// * Types * //
// --------- //

export type UsernameBody = UnknownRecord<"username">;

export type PasswordBody = UnknownRecord<"password">;

export type AuthenticateBody = UsernameBody & PasswordBody;

export type PostUserBody = AuthenticateBody &
  UnknownRecord<"email" | "last_name" | "first_name" | "mobile_number" | "address" | "gender">;

// ----------- //
// * Helpers * //
// ----------- //

export const salted_hash = (password: string) => hash(password, bcrypt_config.salt);

// * validate variants * //

export const validateUsername = <T extends UsernameBody>(body: T) =>
  validate(body, "username", (v) => {
    if (typeof v !== "string" || v.match(/\W/)) return;
    if (v.length < 20) return v;
  });

export const validatePassword = <T extends UnknownRecord<A>, A extends string>(
  body: T,
  alias: A = <A>"password"
) =>
  validate(body, alias, (v) => {
    if (typeof v !== "string" || v.match(/\s/)) return;
    const { length } = v;
    if (length > 8 && length < 50) return v;
  });

export const rawDefaultInvalidMobileNumber = <T extends UnknownRecord<"mobile_number">>(body: T) =>
  rawDefaultInvalid(
    body,
    "mobile_number",
    (v) => (typeof v === "number" || typeof v === "string") && v.toString()
  );

const user_genders: readonly UserGender[] = <const>["F", "M", "O", "N"];

export const rawDefaultInvalidGender = <T extends UnknownRecord<"gender">>(body: T) =>
  rawDefaultInvalid(body, "gender", (v: any) => user_genders.includes(v) && <UserGender>v);

// ---------------- //
// * /users/login * //
// ---------------- //

// *--- POST ---* //

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

// ---------- //
// * /users * //
// ---------- //

// *--- POST ---* //

users_router.post<any, any, any, PostUserBody>("/", ({ body }, res, next) =>
  catchNext(async () => {
    const username = validateUsername(body);
    const password = validatePassword(body);
    const password_hash = await salted_hash(password);
    const email = simpleStringValidate(body, "email");
    const last_name = simpleStringValidate(body, "last_name");
    const first_name = simpleStringRawDefaultInvalid(body, "first_name");
    const mobile_number = rawDefaultInvalidMobileNumber(body);
    const address = simpleStringRawDefaultInvalid(body, "address");
    const gender = rawDefaultInvalidGender(body);

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

export default users_router;

// -------------------- //
// * /users/:username * //
// -------------------- //

import "./user-route";
