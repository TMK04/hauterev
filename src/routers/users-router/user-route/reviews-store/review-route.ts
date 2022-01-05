import type { AuthenticateBody } from "../../types";
import type { PatchReviewBody } from "./types";
import type { IDParams } from "routers/review-router/types";

import users_router from "../../router";
import { deleteReviewByID, UpdateReview, updateReviewByID } from "database/queries";
import { InvalidError } from "routers/utils/Errors";
import { catchNext, isDefined, isEmpty, simpleStringValidate } from "routers/utils/helpers";

import { validateRating } from "./helpers";

// -------------------------------- //
// * /users/:username/reviews/:id * //
// -------------------------------- //

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
