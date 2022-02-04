import type {
  ID,
  InsertReview,
  Review,
  SelectReviewID,
  SelectReviews,
  SelectReviewsOptions,
  Timestamp,
  UpdateReview,
  UserUsername
} from "./types";

import { db } from "connections";

import { helpful_mark_db } from ".";
import { whereMatchAgainst } from "./utils";

// ----------- //
// * Helpers * //
// ----------- //

const reviewTable = () => db<Review>("review");

const selectReviews = () =>
  reviewTable()
    .select("review.*", "helpful_marks.helpful_count")
    .leftJoin(
      helpful_mark_db.selectHelpfulMarksHelpfulCount(),
      "review.id",
      "helpful_marks.review_id"
    );

// ----------- //
// * Queries * //
// ----------- //

// *--- Insert ---* //

export const insertReview = async (insert_review: InsertReview) =>
  reviewTable().insert(insert_review);

// *--- Select ---* //

export const selectAvgRating = () =>
  reviewTable()
    .select("restaurant_id")
    .avg({ avg_rating: "rating" })
    .groupBy("restaurant_id")
    .as("avg_rating");

export const selectReviewsWithOptions = ({
  search
}: SelectReviewsOptions): Promise<SelectReviews> => {
  let query = selectReviews();
  if (search) query = query.andWhereRaw(whereMatchAgainst(["title", "description"]), search);
  return query;
};

export const selectReviewsByRestaurantID = (restaurant_id: ID): Promise<SelectReviews> =>
  selectReviews().where({ "review.restaurant_id": restaurant_id });

export const selectReviewsByUsername = (username: UserUsername): Promise<SelectReviews> =>
  selectReviews().where({ "review.username": username });

export const selectReviewByID = (id: ID): Promise<SelectReviews> =>
  selectReviews().where({ "review.id": id });

/**
 * Use to check if review belongs to user
 *
 * @param id - ID of review
 * @returns - A promised array with
 *  a. 1 review ID if review belongs to user
 *  b. no elements otherwise
 */
export const selectReviewIDByIDnUsername = (
  id: ID,
  username: UserUsername
): Promise<SelectReviewID> => reviewTable().select("id").where({ id, username });

// *--- Update ---* //

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
