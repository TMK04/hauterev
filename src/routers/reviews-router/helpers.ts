import { compare } from "bcryptjs";

import type { RequestHandler } from "express";
import type { AuthenticateBody } from "routers/users-router/types";
import type { UnknownRecord } from "routers/utils/types";

import { selectPasswordHashByUsername } from "database/schemas";
import { NotFoundError, UnauthenticatedError } from "routers/utils/Errors";
import { catchNext, simpleStringValidate, validate } from "routers/utils/helpers";

export const rejectUnauthenticated: RequestHandler<any, any, AuthenticateBody> = (
  { body },
  _,
  next
) =>
  catchNext(async () => {
    const username = simpleStringValidate(body, "username");
    const password = simpleStringValidate(body, "password");

    const password_hash_result = await selectPasswordHashByUsername(username);
    if (!password_hash_result[0]) throw new NotFoundError("User", username);

    const password_hash = password_hash_result[0].password_hash;
    if (await compare(password, password_hash)) return next();

    throw new UnauthenticatedError();
  }, next);

export const validateRating = <T extends UnknownRecord<"rating">>(body: T) =>
  validate(body, "rating", (v) => typeof v === "number" && v >= 1 && v <= 5 && v - (v % 0.5));
