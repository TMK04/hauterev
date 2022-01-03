import type { AuthenticateBody } from "../../types";
import type { UsernameParams } from "../types";
import type { PostReviewBody } from "./types";

import users_router from "../../router";
import { insertReview } from "database/schemas";
import { catchNext, simpleNumberValidate, simpleStringValidate } from "routers/utils/helpers";

import { validateRating } from "./helpers";

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
