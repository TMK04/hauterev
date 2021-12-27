import type { ID, ImageURL, Name, RawDefault } from "../types";

/**
 * @type {TEXT}
 */
export type RestaurantDescription = string;

/**
 * @type {VARCHAR(10)}
 */
export type RestaurantRegion = RawDefault | "North" | "South" | "East" | "West" | "Central";

/**
 * @type {BIT(24)}
 */
export type RestaurantOpeningHours = RawDefault | number;

export interface Restaurant {
  id: ID;
  name: Name;
  description: RestaurantDescription;
  image_url: ImageURL;
  region: RestaurantRegion;
  opening_hours: RestaurantOpeningHours;
}
