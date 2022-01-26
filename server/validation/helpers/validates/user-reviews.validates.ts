import type { UnknownRecord } from "helpers/types";

import validate from "validation/utils/validate";

export const validateRating = <T extends UnknownRecord<"rating">>(body: T) =>
  validate(body, "rating", (v) => typeof v === "number" && v >= 1 && v <= 5 && v - (v % 0.5));
