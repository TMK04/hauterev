import { compare } from "bcryptjs";
import { Router } from "express";

import type { AuthenticateBody, PostUserBody } from "./types";

import { NotFoundError, UnauthenticatedError } from "../utils/Errors";
import { catchNext, simpleStringRawDefaultInvalid, simpleStringValidate } from "../utils/helpers";
import { insertUser, selectPasswordHashByUsername } from "database/schemas";

import {
  rawDefaultInvalidGender,
  rawDefaultInvalidMobileNumber,
  salted_hash,
  validatePassword,
  validateUsername
} from "./helpers";

const users_router = Router();

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
