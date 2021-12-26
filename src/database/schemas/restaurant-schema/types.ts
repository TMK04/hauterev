import type { ID, ImageURL, Name } from "../types";

/**
 * @type {TEXT}
 */
export type RestaurantDescription = string;

/**
 * @type {VARCHAR(10)}
 */
export type RestaurantRegion = "North" | "South" | "East" | "West" | "Central";

/**
 * @type {BIT(24)}
 */
export type RestaurantOpeningHours = number;

export interface Restaurant {
  id: ID;
  name: Name;
  description: RestaurantDescription;
  image_url: ImageURL;
  region?: RestaurantRegion;
  opening_hours?: RestaurantOpeningHours;
}
