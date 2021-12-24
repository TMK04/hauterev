import { compare } from "bcryptjs";
import { Router } from "express";

import { InsertReview, insertReview, selectPasswordHashByUsername } from "database/queries";
import { catchNext, checkBodyProperties } from "routers/helpers";

import { LoginBody, resInvalidPassword, resInvalidUsername } from "./users-router";

const reviews_router = Router();

// ------------ //
// * /reviews * //
// ------------ //

reviews_router.use<any, any, Partial<LoginBody>>(({ body }, res, next) =>
  catchNext(async () => {
    if (!body.username) return resInvalidUsername(res);
    if (!body.password) return resInvalidPassword(res, 403);
    const { username, password } = body;
    delete body.password;

    const password_hash_result = await selectPasswordHashByUsername(username);
    if (!password_hash_result[0]) return resInvalidUsername(res);

    const password_hash = password_hash_result[0].password_hash;
    if (await compare(password, password_hash)) next();
    else resInvalidPassword(res, 403);
  }, next)
);

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

type PostReviewBody = {
  [K in typeof rk_post_review_body[number]]: InsertReview[K];
};

reviews_router.post<any, any, any, PostReviewBody>(
  "/",
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

export default reviews_router;
