import type {
  ID,
  Restaurant,
  SelectRestaurant,
  SelectRestaurants,
  SelectRestaurantsOptions
} from "./types";

import { db } from "connections";

import { review_db } from ".";
import { whereMatchAgainst } from "./utils";

// ----------- //
// * Helpers * //
// ----------- //

const restaurantTable = () => db<Restaurant>("restaurant");

const selectRestaurants = () =>
  restaurantTable()
    .select(
      "restaurant.id",
      "restaurant.name AS name",
      db.raw(`CONCAT(LEFT(restaurant.description, 97), "...") AS description`),
      "restaurant.image_url",
      "restaurant.region",
      "restaurant.opening_hours",
      "avg_rating.avg_rating"
    )
    .leftJoin(review_db.selectAvgRating(), "restaurant.id", "avg_rating.restaurant_id");

// ----------- //
// * Queries * //
// ----------- //

// *--- Select ---* //

export const selectRestaurantIdentifiers = () =>
  restaurantTable().select("id", "name", "image_url").as("restaurant_identifiers");

export const selectRestaurantsWithOptions = ({
  search
}: SelectRestaurantsOptions): Promise<SelectRestaurants> => {
  let query = selectRestaurants();
  if (search) query = query.andWhereRaw(whereMatchAgainst(["name", "description"]), search);
  return query;
};

export const selectTopRatedRestaurants = (): Promise<SelectRestaurants> =>
  selectRestaurants().orderBy("avg_rating.avg_rating", "desc").limit(3);

export const selectRestaurantByID = async (id: ID): Promise<SelectRestaurant> =>
  restaurantTable()
    .select("restaurant.*", "avg_rating.avg_rating")
    .leftJoin(review_db.selectAvgRating(), "restaurant.id", "avg_rating.restaurant_id")
    .where({ "restaurant.id": id });
