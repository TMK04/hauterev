import type { RestaurantIDBody, ReviewIDBody } from "types";

import { numberValidate } from "./helpers/validates";

export const validateRestaurantIDBody = (body: RestaurantIDBody) => ({
  restaurant_id: numberValidate(body, "restaurant_id")
});

export const validateReviewIDBody = (body: ReviewIDBody) => ({
  review_id: numberValidate(body, "review_id")
});
