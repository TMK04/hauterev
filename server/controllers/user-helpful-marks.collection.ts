import type { ReviewIDBody, UsernameParams } from "../types";
import type { RequestHandler } from "express";

import { UnauthorizedError } from "Errors";
import { helpful_mark_db } from "db";
import { catchNext } from "helpers";
import { validateReviewIDBody } from "validation";

export const markAsHelpful: RequestHandler<UsernameParams, any, ReviewIDBody> = (
  { body, params },
  res,
  next
) =>
  catchNext(async () => {
    const { review_id } = validateReviewIDBody(body);
    await helpful_mark_db.insertHelpfulMark({ review_id, username: params.username }).catch(() => {
      throw new UnauthorizedError("Review already marked as helpful");
    });
    res.sendStatus(201);
  }, next);

export const retrieveHelpfulMarks: RequestHandler<UsernameParams> = ({ params }, res, next) =>
  catchNext(
    async () => res.json(await helpful_mark_db.selectHelpfulMarksByUsername(params.username)),
    next
  );

export const unmarkAsHelpful: RequestHandler<UsernameParams, any, ReviewIDBody> = (
  { body, params },
  res,
  next
) =>
  catchNext(async () => {
    const { review_id } = validateReviewIDBody(body);
    await helpful_mark_db.deleteHelpfulMark({ review_id, username: params.username });
    res.sendStatus(204);
  }, next);
