import { Router } from "express";

import type { AuthenticateBody } from "../users-router/types";

import { catchNext, simpleNumberValidate, simpleStringValidate } from "../utils/helpers";
import { insertReview } from "database/schemas";

import { rejectUnauthenticated, validateRating } from "./helpers";
import review_router from "./review-router";
import { PostReviewBody } from "./types";

const reviews_router = Router();

// ----- //
// * / * //
// ----- //

// *--- POST ---* //

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

// -------- //
// * /:id * //
// -------- //

reviews_router.use("/:id", review_router);

export default reviews_router;
