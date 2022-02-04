import type { ID, ImageURL, RawDefault, Timestamp } from "./common.types";
import type { SelectHelpfulCount } from "./helpful-mark.types";
import type { UserUsername } from "./user.types";
import type { Search } from "db/utils/types";

/**
 * @type {VARCHAR(30)}
 */
export type ReviewTitle = string;

/**
 * @type {DECIMAL(2,1)}
 */
export type ReviewRating = number;

/**
 * @type {VARCHAR(255)}
 */
export type ReviewDescription = string;

export interface Review {
  id: ID;
  restaurant_id: ID;
  username: UserUsername;
  rating: ReviewRating;
  title: ReviewTitle;
  description: ReviewDescription;
  image_url: ImageURL;
  posted_timestamp: Timestamp;
  edited_timestamp: Timestamp | RawDefault;
}

export type InsertReview = Omit<Review, "id" | "edited_timestamp">;

export type UpdateReview = Partial<
  Omit<InsertReview, "restaurant_id" | "username" | "posted_timestamp">
>;

export interface SelectReviewsOptions {
  search: Search<Review["title" | "description"]>;
}

export type SelectAvgRating = Record<"avg_rating", ReviewRating>[];
export type SelectReviews = (Review & SelectHelpfulCount)[];
export type SelectReviewID = Record<"id", Review["id"]>[];
