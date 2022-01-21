import type { PasswordBody } from "./users.types";
import type { UnknownRecord } from "utils/types";

export type PostReviewBody = PasswordBody &
  UnknownRecord<"restaurant_id" | "username" | "rating" | "title" | "description" | "image_url">;

export type PatchReviewBody = Omit<PostReviewBody, "restaurant_id">;
