import type { AuthenticateBody } from "routers/users-router/types";
import type { ParamsRecord, UnknownRecord } from "routers/utils/types";

export type IDParams = ParamsRecord<"id">;

export type PostReviewBody = AuthenticateBody &
  UnknownRecord<"restaurant_id" | "username" | "rating" | "title" | "description" | "image_url">;

export type PatchReviewBody = Omit<PostReviewBody, "restaurant_id">;
