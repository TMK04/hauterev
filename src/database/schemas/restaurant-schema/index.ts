import type { ID, Restaurant } from "../types";

import { selectAvgRating, selectReviewsByRestaurantID } from "..";
import db from "database";

// ----------- //
// * Helpers * //
// ----------- //

const restaurantSchema = () => db<Restaurant>("restaurant");

// ----------- //
// * Queries * //
// ----------- //

// *--- Select ---* //

// interface SelectRestaurantsOptions {}

export const selectRestaurants = () => {
  const query = restaurantSchema()
    .select("restaurant.*", "avg_rating.avg_rating")
    .leftJoin(selectAvgRating(), "restaurant.id", "avg_rating.restaurant_id");

  return query;
};

export const selectRestaurantByID = (id: ID) =>
  restaurantSchema()
    .select("restaurant.*", "reviews.avg_rating", "reviews.reviews")
    .leftJoin(selectReviewsByRestaurantID(id), "restaurant.id", "reviews.restaurant_id")
    .where({ "restaurant.id": id });
