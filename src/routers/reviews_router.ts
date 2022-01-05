import { compare } from "bcryptjs";
import { RequestHandler, Router } from "express";

import type { RKMappedRecord } from "./utils/types";
import type { ID, UserUsername } from "database/schemas/types";

import {
  deleteReviewByID,
  InsertReview,
  insertReview,
  selectPasswordHashByUsername,
  selectReviewByID,
  selectReviewIDByIDnUsername,
  updateReviewByID
} from "database/schemas";

import { AuthenticateBody, resInvalidPassword, resInvalidUsername } from "./users-router";
import { catchNext, checkBodyProperties } from "./utils/helpers";

const reviews_router = Router();

// ------------ //
// * /reviews * //
// ------------ //

// *--- Types ---* //

/**
 * Keys belonging to @type {Required} Properties of @see PostReviewBody
 */
const rk_post_review_body = <const>[
  "restaurant_id",
  "username",
  "rating",
  "title",
  "description",
  "image_url"
];

type PostReviewBody = RKMappedRecord<InsertReview, typeof rk_post_review_body>;

// *--- Helpers --- * //

const rejectUnauthenticated: RequestHandler<any, any, Partial<AuthenticateBody>> = (
  { body },
  res,
  next
) =>
  catchNext(async () => {
    if (!body.username) return resInvalidUsername(res);
    if (!body.password) return resInvalidPassword(res, 403);
    const { username, password } = body;
    delete body.password;

    const password_hash_result = await selectPasswordHashByUsername(username);
    if (!password_hash_result[0]) return resInvalidUsername(res);

    const password_hash = password_hash_result[0].password_hash;
    if (await compare(password, password_hash)) return next();
    resInvalidPassword(res, 403);
  }, next);

// *--- Routes ---* //

reviews_router.post<any, any, any, PostReviewBody>(
  "/",
  rejectUnauthenticated,
  checkBodyProperties(rk_post_review_body),
  ({ body }, res, next) =>
    catchNext(async () => {
      const { restaurant_id, username, rating, title, description, image_url } = body;

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

interface UsernameBody {
  username: UserUsername;
}

// *--- Helpers ---* //

const rejectUnauthorized: RequestHandler<IDParams, any, UsernameBody> = (
  { body, params },
  res,
  next
) =>
  catchNext(
    async () =>
      (await selectReviewIDByIDnUsername(params.id, body.username))[0]
        ? next()
        : res.sendStatus(403),
    next
  );

// *--- Routes ---* //

reviews_router.get("/:id", ({ params }, res, next) =>
  catchNext(async () => {
    const { id } = params;
    const review_result = await selectReviewByID(+id);
    const review = review_result[0];
    if (!review) return res.status(404).send("Missing review");
    res.json(review);
  }, next)
);

const nn_patch_review_body = <const>["rating", "title", "description", "image_url"];

type PatchReviewBody = Partial<RKMappedRecord<InsertReview, typeof nn_patch_review_body>>;

reviews_router.patch<IDParams, any, AuthenticateBody & PatchReviewBody>(
  "/:id",
  rejectUnauthenticated,
  rejectUnauthorized,
  checkBodyProperties(nn_patch_review_body, [null, ""], (key) => `Invalid ${key}`),
  ({ body, params }, res, next) =>
    catchNext(async () => {
      const { rating, title, description, image_url } = body;
      await updateReviewByID(+params.id, { rating, title, description, image_url }, new Date());
      res.sendStatus(205);
    }, next)
);

reviews_router.delete<IDParams, any, AuthenticateBody>(
  "/:id",
  rejectUnauthenticated,
  rejectUnauthorized,
  ({ params }, res, next) =>
    catchNext(async () => {
      await deleteReviewByID(+params.id);
      res.sendStatus(204);
    }, next)
);

export default reviews_router;
