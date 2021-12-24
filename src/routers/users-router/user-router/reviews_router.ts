import { Router } from "express";

import type { UsernameParams } from ".";

import { InsertReview, insertReview } from "database/queries";
import { catchNext, checkBodyProperties } from "routers/helpers";

const reviews_router = Router({ mergeParams: true });

/**
 * Keys belonging to @type {Required} Properties of @see PostReviewBody
 */
const rk_post_review_body = <const>["restaurant_id", "rating", "title", "description", "image_url"];

type PostReviewBody = {
  [K in typeof rk_post_review_body[number]]: InsertReview[K];
};

reviews_router.post<UsernameParams, any, any, PostReviewBody>(
  "/",
  checkBodyProperties(rk_post_review_body, [undefined, null, ""]),
  ({ body, params }, res, next) =>
    catchNext(async () => {
      const { username } = params;
      const { restaurant_id, rating, title, description, image_url } = body;

      try {
        await insertReview({
          restaurant_id,
          username,
          rating,
          title,
          description,
          image_url,
          posted_timestamp: new Date()
        });
      } catch (_) {
        return res.status(403).send("Review ID taken");
      }

      res.sendStatus(201);
    }, next)
);

export default reviews_router;
