import type { SelectReviewsOptions } from "db/types";
import type { GetReviewsQuery } from "types";

import { stringNullInvalid } from "./helpers/validates";

export const castGetReviewsQuery = (query: GetReviewsQuery): SelectReviewsOptions => ({
  search: stringNullInvalid(query, "search")
});
