import type { ID, ImageURL, Name, RawDefault, Review } from ".";

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
  search: Restaurant["name" | "description"] | null | undefined;
  rating: Review["rating"] | null | undefined;
  region: Restaurant["region"] | undefined;
  opening_hours?: Restaurant["opening_hours"] | undefined;
}
