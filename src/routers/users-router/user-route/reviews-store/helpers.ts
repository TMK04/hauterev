import type { UsernameParams } from "../types";
import type { RequestHandler } from "express";
import type { IDParams } from "routers/review-router/types";
import type { UnknownRecord } from "routers/utils/types";

import { selectReviewIDByIDnUsername } from "database/queries";
import { UnauthorizedError } from "routers/utils/Errors";
import { catchNext, validate } from "routers/utils/helpers";

// ---------------------------- //
// * validate Implementations * //
// ---------------------------- //

export const validateRating = <T extends UnknownRecord<"rating">>(body: T) =>
  validate(body, "rating", (v) => typeof v === "number" && v >= 1 && v <= 5 && v - (v % 0.5));

// -------- //
// * auth * //
// -------- //

/**
 * Reject both unauthenticated & unauthorized requests
 */
export const rejectUnauthorized: RequestHandler<IDParams & UsernameParams> = (
  { params },
  _,
  next
) =>
  catchNext(async () => {
    const review_id_result = await selectReviewIDByIDnUsername(+params.id, params.username);
    if (review_id_result[0]) return next();

    throw new UnauthorizedError("Review belongs to another user");
  }, next);
