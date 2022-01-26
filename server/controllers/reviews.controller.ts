import type { RequestHandler } from "express";
import type { IDParams } from "types";

import { NotFoundError } from "Errors";
import { review_db } from "db";
import { catchNext } from "helpers";

export const retrieveReview: RequestHandler<IDParams> = ({ params }, res, next) =>
  catchNext(async () => {
    const { id } = params;
    const review_result = await review_db.selectReviewByID(+id);
    const review = review_result[0];
    if (!review) throw new NotFoundError("Review", id);
    res.json(review);
  }, next);
