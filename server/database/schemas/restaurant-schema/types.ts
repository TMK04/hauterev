import type { ID, ImageURL, Name, RawDefault, Review } from "../types";

/**
 * @type {TEXT}
 */
export type RestaurantDescription = string;

/**
 * @type {VARCHAR(10)}
 */
export type RestaurantRegion = RawDefault | "North" | "South" | "East" | "West" | "Central";

/**
 * @type {MEDIUMINT UNSIGNED}
 */
export type RestaurantOpeningHours = RawDefault | number;

export interface Restaurant {
  id: ID;
  name: Name;
  description: RestaurantDescription;
  image_url: ImageURL;
  region: RestaurantRegion | null;
  opening_hours: RestaurantOpeningHours | null;
}

export interface SelectRestaurantsOptions {
  search?: Restaurant["name" | "description"] | null;
  rating?: Review["rating"] | null;
  region?: Restaurant["region"];
  opening_hours?: Restaurant["opening_hours"];
}
