import type { UsernameParams } from ".";
import type { AuthenticateBody } from "..";
import type { RequestHandler } from "express";
import type { IDParams, UnknownRecord } from "routers/types";

import users_router from "..";
import {
  deleteReviewByID,
  insertReview,
  selectReviewIDByIDnUsername,
  UpdateReview,
  updateReviewByID
} from "database/queries";
import { InvalidError, UnauthorizedError } from "routers/Errors";
import {
  catchNext,
  isDefined,
  isEmpty,
  simpleNumberValidate,
  simpleStringValidate,
  validate
} from "routers/helpers";

// --------- //
// * Types * //
// --------- //

export type PostReviewBody = AuthenticateBody &
  UnknownRecord<"restaurant_id" | "username" | "rating" | "title" | "description" | "image_url">;

export type PatchReviewBody = Omit<PostReviewBody, "restaurant_id">;

// ----------- //
// * Helpers * //
// ----------- //

// *--- validate variants ---* //

export const validateRating = <T extends UnknownRecord<"rating">>(body: T) =>
  validate(body, "rating", (v) => typeof v === "number" && v >= 1 && v <= 5 && v - (v % 0.5));

// *--- auth ---* //

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

// ---------------------------- //
// * /users/:username/reviews * //
// ---------------------------- //

users_router.post<UsernameParams, any, any, AuthenticateBody & PostReviewBody>(
  "/:username/reviews",
  ({ body, params }, res, next) =>
    catchNext(async () => {
      const { username } = params;
      const restaurant_id = simpleNumberValidate(body, "restaurant_id");
      const rating = validateRating(body);
      const title = simpleStringValidate(body, "title");
      const description = simpleStringValidate(body, "description");
      const image_url = simpleStringValidate(body, "image_url");

      await insertReview({
        restaurant_id,
        username,
        rating,
        title,
        description,
        image_url,
        posted_timestamp: new Date()
      });

      res.sendStatus(201);
    }, next)
);

// -------------------------------- //
// * /users/:username/reviews/:id * //
// -------------------------------- //

users_router.use("/:username/reviews/:id", rejectUnauthorized);

// *--- PATCH ---* //

users_router.patch<IDParams, any, PatchReviewBody>(
  "/:username/reviews/:id",
  ({ body, params }, res, next) =>
    catchNext(async () => {
      const { rating, title, description, image_url } = body;

      const update_review: UpdateReview = {};
      if (isDefined(rating)) update_review.rating = validateRating(body);
      if (isDefined(title)) update_review.title = simpleStringValidate(body, "title");
      if (isDefined(description))
        update_review.description = simpleStringValidate(body, "description");
      if (isDefined(image_url)) update_review.image_url = simpleStringValidate(body, "image_url");

      if (isEmpty(update_review)) throw new InvalidError("body");

      await updateReviewByID(+params.id, update_review, new Date());
      res.sendStatus(205);
    }, next)
);

// *--- DELETE ---* //

users_router.delete<IDParams, any, AuthenticateBody>(
  "/:username/reviews/:id",
  ({ params }, res, next) =>
    catchNext(async () => {
      await deleteReviewByID(+params.id);
      res.sendStatus(204);
    }, next)
);
