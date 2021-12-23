import type { HelpfulMark, Restaurant, Review } from "database/schemas";

import db from "database";

interface SelectRestaurantsOptions {
  id?: number;
}

export const selectRestaurants = ({ id }: SelectRestaurantsOptions = {}) => {
  let query = db<Restaurant>("restaurant")
    .select("restaurant.*", "reviews.avg_rating", "reviews.reviews")
    .leftJoin(
      db<Review>("review")
        .select(
          "review.restaurant_id AS restaurant_id",
          db.raw(`JSON_OBJECTAGG(id, JSON_OBJECT(
          "username", review.username,
          "rating", review.rating,
          "title", review.title,
          "description", review.description,
          "image_url", review.image_url,
          "posted_timestamp", review.posted_timestamp,
          "edited_timestamp", review.edited_timestamp,
          "helpful_count", helpful_marks.count
        )) AS reviews`)
        )
        .avg({ avg_rating: "rating" })
        .leftJoin(
          db<HelpfulMark>("helpful_mark")
            .select("review_id")
            .count({ count: "*" })
            .from("helpful_mark")
            .groupBy("review_id")
            .as("helpful_marks"),
          "review.id",
          "helpful_marks.review_id"
        )
        .groupBy("restaurant_id")
        .as("reviews"),
      "restaurant.id",
      "reviews.restaurant_id"
    );

  if (id) query = query.where({ "restaurant.id": id });

  return query;
};
