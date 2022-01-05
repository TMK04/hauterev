import type { ID, Review, Timestamp, UserUsername } from "../types";

import { selectHelpfulMarksHelpfulCount } from "..";
import db from "database";

// ----------- //
// * Helpers * //
// ----------- //

const reviewTable = () => db<Review>("review");

const jsonObjectAgg = (key: string, value: string, alias = "") =>
  `JSON_OBJECTAGG(${key}, ${value})${alias && ` AS ${alias}`}`;

type TableColumn = `${string}.${string}`;

type JsonObjectKeyValue = `"${string}", ${string}`;

const jsonObject = (...table_columns: TableColumn[]) => {
  const key_value_arr: JsonObjectKeyValue[] = [];
  for (const table_column of table_columns) {
    const column = table_column.split(/\./)[1];
    if (column) key_value_arr.push(`"${column}", ${table_column}`);
  }
  return `JSON_OBJECT(${key_value_arr.join(", ")})`;
};

// ----------- //
// * Queries * //
// ----------- //

// *--- Insert ---* //

export type InsertReview = Omit<Review, "id" | "edited_timestamp">;

export const insertReview = async (insert_review: InsertReview) =>
  reviewTable().insert(insert_review);

// *--- Select ---* //

export const selectAvgRating = () =>
  reviewTable()
    .select("restaurant_id")
    .avg({ avg_rating: "rating" })
    .groupBy("restaurant_id")
    .as("avg_rating");

const reviews_columns: TableColumn[] = [
  "review.rating",
  "review.title",
  "review.description",
  "review.image_url",
  "review.posted_timestamp",
  "review.edited_timestamp",
  "helpful_marks.helpful_count"
];

export const selectReviewsByRestaurantID = (restaurant_id: ID) =>
  reviewTable()
    .select(
      "review.restaurant_id AS restaurant_id",
      db.raw(
        jsonObjectAgg("review.id", jsonObject("review.username", ...reviews_columns), "reviews")
      )
    )
    .avg({ avg_rating: "rating" })
    .leftJoin(selectHelpfulMarksHelpfulCount(), "review.id", "helpful_marks.review_id")
    .where({ restaurant_id })
    .groupBy("restaurant_id")
    .as("reviews");

export const selectReviewsByUsername = (username: UserUsername) =>
  reviewTable()
    .select(
      "review.username AS username",
      db.raw(
        jsonObjectAgg(
          "review.id",
          jsonObject("review.restaurant_id", ...reviews_columns),
          "reviews"
        )
      )
    )
    .leftJoin(selectHelpfulMarksHelpfulCount(), "review.id", "helpful_marks.review_id")
    .where({ username })
    .groupBy("username")
    .as("reviews");

export const selectReviewByID = (id: ID) =>
  reviewTable()
    .select("review.*", "helpful_marks.helpful_count")
    .leftJoin(selectHelpfulMarksHelpfulCount(), "review.id", "helpful_marks.review_id")
    .where({ "review.id": id });

/**
 * Use to check if review belongs to user
 *
 * @param id - ID of review
 * @returns - A promised array with
 *  a. 1 review ID if review belongs to user
 *  b. no elements otherwise
 */
export const selectReviewIDByIDnUsername = (id: ID, username: UserUsername) =>
  reviewTable().select("id").where({ id, username });

// *--- Update ---* //

export type UpdateReview = Partial<Omit<Review, `${string}id` | "username" | `${string}timestamp`>>;

export const updateReviewByID = (
  id: ID,
  update_review: UpdateReview,
  edited_timestamp: Timestamp
) =>
  reviewTable()
    .update({ ...update_review, edited_timestamp })
    .where({ id });

// *--- Delete ---* //

export const deleteReviewByID = (id: ID) => reviewTable().del().where({ id });
