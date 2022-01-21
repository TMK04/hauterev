import type { UpdateReview } from "db/types";
import type { PatchReviewBody, PostReviewBody } from "types";

import { InvalidError } from "Errors";

import { isDefined, isEmpty } from "./helpers/checks";
import { stringValidate, validateRating } from "./helpers/validates";
import { validateRestaurantIDBody } from "./ref.validation";

export const validatePostReviewBody = (body: PostReviewBody) => ({
  ...validateRestaurantIDBody(body),
  description: stringValidate(body, "description"),
  image_url: stringValidate(body, "password"),
  title: stringValidate(body, "title"),
  rating: validateRating(body)
});

export const validatePatchReviewBody = (body: PatchReviewBody): UpdateReview => {
  const { rating, title, description, image_url } = body;

  const update_review: UpdateReview = {};
  if (isDefined(rating)) update_review.rating = validateRating(body);
  if (isDefined(title)) update_review.title = stringValidate(body, "title");
  if (isDefined(description)) update_review.description = stringValidate(body, "description");
  if (isDefined(image_url)) update_review.image_url = stringValidate(body, "image_url");

  if (isEmpty(update_review)) throw new InvalidError("body");

  return update_review;
};
