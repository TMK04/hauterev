import type { RequestHandler } from "express";
import type { IDParams, UsernameParams } from "types";

import { UnauthorizedError } from "Errors";
import { review_db } from "db";
import { catchNext } from "utils";

/**
 * Reject both unauthenticated & unauthorized requests
 */
export const rejectUnauthorized: RequestHandler<IDParams & UsernameParams> = (
  { params },
  _,
  next
) =>
  catchNext(async () => {
    const review_id_result = await review_db.selectReviewIDByIDnUsername(
      +params.id,
      params.username
    );
    if (review_id_result[0]) return next();

    throw new UnauthorizedError("Review belongs to another user");
  }, next);
