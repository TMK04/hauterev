import type { ID, ImageURL, Timestamp, UserUsername } from ".";

import db from "database";

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
  edited_timestamp?: Timestamp;
}

const reviewSchema = () => db<Review>("review");

export default reviewSchema;
