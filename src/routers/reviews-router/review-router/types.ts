import type { PostReviewBody } from "../types";
import type { ParamRecord } from "routers/utils/types";

export type IDParams = ParamRecord<"id">;

export type PatchReviewBody = Omit<PostReviewBody, "restaurant_id">;
