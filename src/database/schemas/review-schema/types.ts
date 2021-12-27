import type { ID, ImageURL, RawDefault, Timestamp, UserUsername } from "../types";

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

export type EditedTimestamp = RawDefault | Timestamp;
export interface Review {
  id: ID;
  restaurant_id: ID;
  username: UserUsername;
  rating: ReviewRating;
  title: ReviewTitle;
  description: ReviewDescription;
  image_url: ImageURL;
  posted_timestamp: Timestamp;
  edited_timestamp: EditedTimestamp;
}
