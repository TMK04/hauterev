import type { Unpartial } from "./types";

import db from "database";
import { ID, Review, reviewSchema, UserUsername } from "database/schemas";

import { selectHelpfulMarksCount } from ".";
import { filter } from "./helpers";

export type InsertReview = Unpartial<Omit<Review, "id" | "edited_timestamp">>;

export const insertReview = async (insert_review: InsertReview) =>
  reviewSchema().insert(filter(insert_review));

export const selectAvgRating = () =>
  reviewSchema()
    .select("restaurant_id")
    .avg({ avg_rating: "rating" })
    .groupBy("restaurant_id")
    .as("avg_rating");

const jsonObjectAgg = (key: string, value: string, alias = "") =>
  `JSON_OBJECTAGG(${key}, ${value})${alias && ` AS ${alias}`}`;

type SchemaColumn = `${string}.${string}`;

type JsonObjectKeyValue = `"${string}", ${string}`;

const jsonObject = (...schema_columns: SchemaColumn[]) => {
  const key_value_arr: JsonObjectKeyValue[] = [];
  for (const schema_column of schema_columns) {
    const column = schema_column.split(/\./)[1];
    if (column) key_value_arr.push(`"${column}", ${schema_column}`);
  }
  return `JSON_OBJECT(${key_value_arr.join(", ")})`;
};

const reviews_columns: SchemaColumn[] = [
  "review.rating",
  "review.title",
  "review.description",
  "review.image_url",
  "review.posted_timestamp",
  "review.edited_timestamp",
  "helpful_marks.count"
];

export const selectReviewsByRestaurantID = (restaurant_id: ID) =>
  reviewSchema()
    .select(
      "review.restaurant_id AS restaurant_id",
      db.raw(
        jsonObjectAgg("review.id", jsonObject("review.username", ...reviews_columns), "reviews")
      )
    )
    .avg({ avg_rating: "rating" })
    .leftJoin(selectHelpfulMarksCount(), "review.id", "helpful_marks.review_id")
    .where({ restaurant_id })
    .groupBy("restaurant_id")
    .as("reviews");

export const selectReviewsByUsername = (username: UserUsername) =>
  reviewSchema()
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
    .leftJoin(selectHelpfulMarksCount(), "review.id", "helpful_marks.review_id")
    .where({ username })
    .groupBy("username")
    .as("reviews");

export const selectReviewByID = (id: ID) =>
  reviewSchema()
    .select("review.*", "helpful_marks.count")
    .leftJoin(selectHelpfulMarksCount(), "review.id", "helpful_marks.review_id")
    .where({ "review.id": id });
