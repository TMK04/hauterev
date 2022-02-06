import type { UnknownRecord } from "helpers/types";

export type PostReviewBody = UnknownRecord<
  "restaurant_id" | "username" | "rating" | "title" | "description" | "image_url"
>;

export type PatchReviewBody = Omit<PostReviewBody, "restaurant_id">;
