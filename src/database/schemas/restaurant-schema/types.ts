import type { ID, ImageURL, Name } from "../types";

/**
 * @type {TEXT}
 */
export type RestaurantDescription = string;

/**
 * @type {VARCHAR(10)}
 */
export type RestaurantRegion = null | "North" | "South" | "East" | "West" | "Central";

/**
 * @type {MEDIUMINT UNSIGNED}
 */
export type RestaurantOpeningHours = null | number;

export interface Restaurant {
  id: ID;
  name: Name;
  description: RestaurantDescription;
  image_url: ImageURL;
  region: RestaurantRegion;
  opening_hours: RestaurantOpeningHours;
}

export interface SelectRestaurantsOptions {
  region?: RestaurantRegion;
  opening_hours?: RestaurantOpeningHours;
}
