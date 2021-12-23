import bookmarkSchema from "./bookmarkSchema";
import helpfulMarkSchema from "./helpfulMarkSchema";
import restaurantSchema from "./restaurantSchema";
import reviewSchema from "./reviewSchema";
import userCredentialsSchema from "./userCredentialsSchema";
import userInfoSchema from "./userInfoSchema";

/**
 * @type {INT}
 */
export type ID = number;
/**
 * @type {VARCHAR(50)}
 */
export type Name = string;
/**
 * @type {VARCHAR(255)}
 */
export type ImageURL = string;
/**
 * @type {TIMESTAMP}
 */
export type Timestamp = Date;

export {
  bookmarkSchema,
  helpfulMarkSchema,
  restaurantSchema,
  reviewSchema,
  userCredentialsSchema,
  userInfoSchema
};

export * from "./bookmarkSchema";
export * from "./helpfulMarkSchema";
export * from "./restaurantSchema";
export * from "./reviewSchema";
export * from "./userCredentialsSchema";
export * from "./userInfoSchema";
