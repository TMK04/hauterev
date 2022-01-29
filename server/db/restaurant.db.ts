import type { ID, Restaurant, SelectRestaurantsOptions } from "./types";

import { db } from "connections";

import { review_db } from ".";

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

export const selectRestaurantsWithOptions = ({ search }: SelectRestaurantsOptions) => {
  let query = selectRestaurants();
  if (search)
    query = query.andWhereRaw(
      "MATCH (name, description) AGAINST (? IN NATURAL LANGUAGE MODE)",
      search
    );
  return query;
};

export const selectTopRatedRestaurants = () =>
  selectRestaurants().orderBy("avg_rating.avg_rating", "desc").limit(3);

export const selectRestaurantByID = async (id: ID) => {
  const restaurants = await restaurantTable()
    .select("restaurant.*", "avg_rating.avg_rating")
    .leftJoin(review_db.selectAvgRating(), "restaurant.id", "avg_rating.restaurant_id")
    .where({ "restaurant.id": id });

  if (!restaurants[0]) return restaurants;

  restaurants[0].reviews = await review_db.selectReviewsByRestaurantID(id);
  return restaurants;
};
