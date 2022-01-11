"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReviewByID =
  exports.updateReviewByID =
  exports.selectReviewIDByIDnUsername =
  exports.selectReviewByID =
  exports.selectReviewsByUsername =
  exports.selectReviewsByRestaurantID =
  exports.selectAvgRating =
  exports.insertReview =
    void 0;
const __1 = require("..");
const database_1 = __importDefault(require("database"));
// ----------- //
// * Helpers * //
// ----------- //
const reviewTable = () => (0, database_1.default)("review");
const jsonObjectAgg = (key, value, alias = "") =>
  `JSON_OBJECTAGG(${key}, ${value})${alias && ` AS ${alias}`}`;
const jsonObject = (...table_columns) => {
  const key_value_arr = [];
  for (const table_column of table_columns) {
    const column = table_column.split(/\./)[1];
    if (column) key_value_arr.push(`"${column}", ${table_column}`);
  }
  return `JSON_OBJECT(${key_value_arr.join(", ")})`;
};
const insertReview = (insert_review) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return reviewTable().insert(insert_review);
  });
exports.insertReview = insertReview;
// *--- Select ---* //
const selectAvgRating = () =>
  reviewTable()
    .select("restaurant_id")
    .avg({ avg_rating: "rating" })
    .groupBy("restaurant_id")
    .as("avg_rating");
exports.selectAvgRating = selectAvgRating;
const reviews_columns = [
  "review.rating",
  "review.title",
  "review.description",
  "review.image_url",
  "review.posted_timestamp",
  "review.edited_timestamp",
  "helpful_marks.helpful_count",
];
const selectReviewsByRestaurantID = (restaurant_id) =>
  reviewTable()
    .select(
      "review.restaurant_id AS restaurant_id",
      database_1.default.raw(
        jsonObjectAgg(
          "review.id",
          jsonObject("review.username", ...reviews_columns),
          "reviews"
        )
      )
    )
    .avg({ avg_rating: "rating" })
    .leftJoin(
      (0, __1.selectHelpfulMarksHelpfulCount)(),
      "review.id",
      "helpful_marks.review_id"
    )
    .where({ restaurant_id })
    .groupBy("restaurant_id")
    .as("reviews");
exports.selectReviewsByRestaurantID = selectReviewsByRestaurantID;
const selectReviewsByUsername = (username) =>
  reviewTable()
    .select(
      "review.username AS username",
      database_1.default.raw(
        jsonObjectAgg(
          "review.id",
          jsonObject("review.restaurant_id", ...reviews_columns),
          "reviews"
        )
      )
    )
    .leftJoin(
      (0, __1.selectHelpfulMarksHelpfulCount)(),
      "review.id",
      "helpful_marks.review_id"
    )
    .where({ username })
    .groupBy("username")
    .as("reviews");
exports.selectReviewsByUsername = selectReviewsByUsername;
const selectReviewByID = (id) =>
  reviewTable()
    .select("review.*", "helpful_marks.helpful_count")
    .leftJoin(
      (0, __1.selectHelpfulMarksHelpfulCount)(),
      "review.id",
      "helpful_marks.review_id"
    )
    .where({ "review.id": id });
exports.selectReviewByID = selectReviewByID;
/**
 * Use to check if review belongs to user
 *
 * @param id - ID of review
 * @returns - A promised array with
 *  a. 1 review ID if review belongs to user
 *  b. no elements otherwise
 */
const selectReviewIDByIDnUsername = (id, username) =>
  reviewTable().select("id").where({ id, username });
exports.selectReviewIDByIDnUsername = selectReviewIDByIDnUsername;
const updateReviewByID = (id, update_review, edited_timestamp) =>
  reviewTable()
    .update(
      Object.assign(Object.assign({}, update_review), { edited_timestamp })
    )
    .where({ id });
exports.updateReviewByID = updateReviewByID;
// *--- Delete ---* //
const deleteReviewByID = (id) => reviewTable().del().where({ id });
exports.deleteReviewByID = deleteReviewByID;
