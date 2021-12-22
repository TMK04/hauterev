<<<<<<< HEAD
import type { ID, ImageURL, Name } from ".";
=======
import type { ID, ImageURL, Name } from "./types";
>>>>>>> 3049c2f (feat(knex): add knex.js to build queries & make transactions)

import db from "database";

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

const restaurantSchema = () => db<Restaurant>("restaurant");

export default restaurantSchema;
