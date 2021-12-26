import bookmarkSchema from "./bookmarkSchema";
import helpfulMarkSchema from "./helpfulMarkSchema";
import restaurantSchema from "./restaurantSchema";
import reviewSchema from "./reviewSchema";
import userSchema from "./userSchema";

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

export { bookmarkSchema, helpfulMarkSchema, restaurantSchema, reviewSchema, userSchema };

export * from "./bookmarkSchema";
export * from "./helpfulMarkSchema";
export * from "./restaurantSchema";
export * from "./reviewSchema";
export * from "./userSchema";
