import { compare } from "bcryptjs";
import { RequestHandler, Router } from "express";

import type { AuthenticateBody } from "./users-router/types";
import type { UnknownRecord } from "./utils/types";
import type { ID } from "database/schemas/types";

import {
  deleteReviewByID,
  insertReview,
  selectPasswordHashByUsername,
  selectReviewByID,
  selectReviewIDByIDnUsername,
  UpdateReview,
  updateReviewByID
} from "database/schemas";

import {
  InvalidError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError
} from "./utils/Errors";
import {
  catchNext,
  isDefined,
  isEmpty,
  simpleNumberValidate,
  simpleStringValidate,
  validate
} from "./utils/helpers";

const reviews_router = Router();

// ------------ //
// * /reviews * //
// ------------ //

// *--- Helpers --- * //

const rejectUnauthenticated: RequestHandler<any, any, AuthenticateBody> = ({ body }, _, next) =>
  catchNext(async () => {
    const username = simpleStringValidate(body, "username");
    const password = simpleStringValidate(body, "password");

    const password_hash_result = await selectPasswordHashByUsername(username);
    if (!password_hash_result[0]) throw new NotFoundError("User", username);

    const password_hash = password_hash_result[0].password_hash;
    if (await compare(password, password_hash)) return next();

    throw new UnauthenticatedError();
  }, next);

const validateRating = <T extends UnknownRecord<"rating">>(body: T) =>
  validate(body, "rating", (v) => typeof v === "number" && v >= 1 && v <= 5 && v - (v % 0.5));

// *--- Routes ---* //

type PostReviewBody = UnknownRecord<
  "restaurant_id" | "username" | "rating" | "title" | "description" | "image_url"
>;

reviews_router.post<any, any, any, AuthenticateBody & PostReviewBody>(
  "/",
  rejectUnauthenticated,
  ({ body }, res, next) =>
    catchNext(async () => {
      const restaurant_id = simpleNumberValidate(body, "restaurant_id");
      const username = simpleStringValidate(body, "username");
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

// ---------------- //
// * /reviews/:id * //
// ---------------- //

// *--- Types ---* //

interface IDParams {
  id: ID;
}

// *--- Helpers ---* //

/**
 * Reject both unauthenticated & unauthorized requests
 */
const rejectUnauthed: RequestHandler<IDParams, any, AuthenticateBody> = (
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

    const review_id_result = await selectReviewIDByIDnUsername(params.id, <string>body.username);
    if (review_id_result[0]) return next();

    throw new UnauthorizedError("Review belongs to another user");
  }, next);

// *--- Routes ---* //

reviews_router.get("/:id", ({ params }, res, next) =>
  catchNext(async () => {
    const { id } = params;
    const review_result = await selectReviewByID(+id);
    const review = review_result[0];
    if (!review) throw new NotFoundError("Review", id);
    res.json(review);
  }, next)
);

type PatchReviewBody = Omit<PostReviewBody, "restaurant_id" | "username">;

reviews_router.patch<IDParams, any, AuthenticateBody & PatchReviewBody>(
  "/:id",
  rejectUnauthed,
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

reviews_router.delete<IDParams, any, AuthenticateBody>(
  "/:id",
  rejectUnauthed,
  ({ params }, res, next) =>
    catchNext(async () => {
      await deleteReviewByID(+params.id);
      res.sendStatus(204);
    }, next)
);

export default reviews_router;
