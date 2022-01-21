import type { IDParams, PatchReviewBody, PostReviewBody, UsernameParams } from "../types";
import type { RequestHandler } from "express";

import { review_db } from "db";
import { catchNext } from "utils";
import { validatePatchReviewBody, validatePostReviewBody } from "validation";

export const createReview: RequestHandler<UsernameParams, any, any, PostReviewBody> = (
  { body, params },
  res,
  next
) =>
  catchNext(async () => {
    const { username } = params;

    await review_db.insertReview({
      username,
      ...validatePostReviewBody(body),
      posted_timestamp: new Date()
    });

    res.sendStatus(201);
  }, next);

export const updateReview: RequestHandler<IDParams, any, PatchReviewBody> = (
  { body, params },
  res,
  next
) =>
  catchNext(async () => {
    await review_db.updateReviewByID(+params.id, validatePatchReviewBody(body), new Date());
    res.sendStatus(205);
  }, next);

export const deleteReview: RequestHandler<IDParams> = ({ params }, res, next) =>
  catchNext(async () => {
    await review_db.deleteReviewByID(+params.id);
    res.sendStatus(204);
  }, next);
