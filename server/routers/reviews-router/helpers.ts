import { compare } from "bcryptjs";

import type { IDParams } from "./types";
import type { RequestHandler } from "express";
import type { AuthenticateBody } from "routers/users-router/types";
import type { UnknownRecord } from "routers/utils/types";

import { selectPasswordHashByUsername, selectReviewIDByIDnUsername } from "database/queries";
import { NotFoundError, UnauthenticatedError, UnauthorizedError } from "routers/utils/Errors";
import { catchNext, simpleStringValidate, validate } from "routers/utils/helpers";

// ---------------------------- //
// * validate Implementations * //
// ---------------------------- //

export const validateRating = <T extends UnknownRecord<"rating">>(body: T) =>
  validate(body, "rating", (v) => typeof v === "number" && v >= 1 && v <= 5 && v - (v % 0.5));

// -------- //
// * auth * //
// -------- //

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

/**
 * Reject both unauthenticated & unauthorized requests
 */
export const rejectUnauthed: RequestHandler<IDParams, any, AuthenticateBody> = (
  { body, params },
  _,
  next
) =>
  catchNext(async () => {
    const username = simpleStringValidate(body, "username");
    const password = simpleStringValidate(body, "password");

    const password_hash_result = await selectPasswordHashByUsername(username);
    if (!password_hash_result[0]) throw new NotFoundError("User", username);

    const password_hash = password_hash_result[0].password_hash;
    if (!(await compare(password, password_hash))) throw new UnauthenticatedError();

    const review_id_result = await selectReviewIDByIDnUsername(+params.id, <string>body.username);
    if (review_id_result[0]) return next();

    throw new UnauthorizedError("Review belongs to another user");
  }, next);
