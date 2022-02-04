import type { RequestHandler } from "express";
import type { GetReviewsQuery, IDParams } from "types";

import { NotFoundError } from "Errors";
import { review_db } from "db";
import { catchNext } from "helpers";
import { castGetReviewsQuery } from "validation";

export const retrieveReviews: RequestHandler<any, any, any, GetReviewsQuery> = (
  { query },
  res,
  next
) =>
  catchNext(
    async () => res.json(await review_db.selectReviewsWithOptions(castGetReviewsQuery(query))),
    next
  );

export const retrieveMostHelpfulReviews: RequestHandler = (_, res, next) =>
  catchNext(async () => res.json(await review_db.selectMostHelpfulReviews()), next);

export const retrieveReview: RequestHandler<IDParams> = ({ params }, res, next) =>
  catchNext(async () => {
    const { id } = params;
    const review_result = await review_db.selectReviewByID(+id);
    const review = review_result[0];
    if (!review) throw new NotFoundError("Review", id);
    res.json(review);
  }, next);
