import type { IDParams, PatchReviewBody } from "./types";
import type { AuthenticateBody } from "routers/users-router/types";

import {
  deleteReviewByID,
  selectReviewByID,
  UpdateReview,
  updateReviewByID
} from "database/queries";
import { InvalidError, NotFoundError } from "routers/utils/Errors";
import { catchNext, isDefined, isEmpty, simpleStringValidate } from "routers/utils/helpers";

import { rejectUnauthed, validateRating } from "./helpers";
import reviews_router from "./router";

// ---------------- //
// * /reviews/:id * //
// ---------------- //

// *--- GET ---* //

reviews_router.get<IDParams>("/:id", ({ params }, res, next) =>
  catchNext(async () => {
    const { id } = params;
    const review_result = await selectReviewByID(+id);
    const review = review_result[0];
    if (!review) throw new NotFoundError("Review", id);
    res.json(review);
  }, next)
);

// *--- PATCH ---* //

reviews_router.patch<IDParams, any, PatchReviewBody>(
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

// *--- DELETE ---* //

reviews_router.delete<IDParams, any, AuthenticateBody>(
  "/:id",
  rejectUnauthed,
  ({ params }, res, next) =>
    catchNext(async () => {
      await deleteReviewByID(+params.id);
      res.sendStatus(204);
    }, next)
);
