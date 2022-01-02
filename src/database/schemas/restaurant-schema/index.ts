import type { ID, Restaurant } from "../types";
import type { SelectRestaurantsOptions } from "./types";

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

export const selectRestaurants = ({
  opening_hours,
  rating,
  region,
  search
}: SelectRestaurantsOptions) => {
  let query = restaurantSchema()
    .select(
      "restaurant.id",
      "restaurant.name AS name",
      db.raw(`CONCAT(LEFT(restaurant.description, 197), "...") AS description`),
      "restaurant.image_url",
      "restaurant.region",
      "restaurant.opening_hours",
      "avg_rating.avg_rating"
    )
    .leftJoin(selectAvgRating(), "restaurant.id", "avg_rating.restaurant_id");

  if (search)
    query = query.andWhereRaw(
      "MATCH (name, description) AGAINST (? IN NATURAL LANGUAGE MODE)",
      search
    );
  if (rating) query = query.andWhere("avg_rating.avg_rating", ">=", rating);
  if (region) query = query.andWhere("restaurant.region", region);
  if (opening_hours) query = query.andWhereRaw("(restaurant.opening_hours & ?) > 0", opening_hours);

  return query;
};

export const selectRestaurantByID = (id: ID) =>
  restaurantSchema()
    .select("restaurant.*", "reviews.avg_rating", "reviews.reviews")
    .leftJoin(selectReviewsByRestaurantID(id), "restaurant.id", "reviews.restaurant_id")
    .where({ "restaurant.id": id });
