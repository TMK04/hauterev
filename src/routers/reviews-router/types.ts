import type { AuthenticateBody } from "routers/users-router/types";
import type { ParamRecord, UnknownRecord } from "routers/utils/types";

export type IDParams = ParamRecord<"id">;

export type PostReviewBody = AuthenticateBody &
  UnknownRecord<"restaurant_id" | "username" | "rating" | "title" | "description" | "image_url">;

export type PatchReviewBody = Omit<PostReviewBody, "restaurant_id">;
