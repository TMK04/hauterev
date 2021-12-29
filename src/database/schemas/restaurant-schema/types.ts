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
 * @type {MEDIUMINT UNSIGNED}
 */
export type RestaurantOpeningHours = number;

export interface Restaurant {
  id: ID;
  name: Name;
  description: RestaurantDescription;
  image_url: ImageURL;
  region: RestaurantRegion | null;
  opening_hours: RestaurantOpeningHours | null;
}

export interface SelectRestaurantsOptions {
  region?: Restaurant["region"];
  opening_hours?: Restaurant["opening_hours"];
}
