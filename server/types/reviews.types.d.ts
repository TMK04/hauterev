import type { SelectReviewsOptions } from "db/types";
import type { QueryRecord } from "helpers/types";

export type GetReviewsQuery = {
  [K in keyof SelectReviewsOptions]-?: QueryRecord<K>[K];
};
