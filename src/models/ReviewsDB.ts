import type { EditReview, PostReview } from "./Review";
import type SQLCallback from "./SQLCallback";
import type { Query } from "mysql2";

import db from "connection";
import { deleteFrom, insertInto, select, update, where } from "helpers/sql-statements";

export default class ReviewsDB {
  getAllReviews = (callback?: SQLCallback): Query => db.query(select("review"), callback);

  getReview = (review_id: number, callback?: SQLCallback): Query =>
    db.query(where(select("review"), "id=?"), review_id, callback);

  postReview = (review: PostReview, callback?: SQLCallback): Query =>
    db.query(insertInto("review", Object.keys(review)), Object.values(review), callback);

  editReview = (review: EditReview, callback?: SQLCallback): Query => {
    const fields = (<(keyof EditReview)[]>Object.keys(review)).filter((field) => field !== "id");

    const values = fields.map((field) => review[field]);
    values.push(review.id);

    return db.query(update("review", fields, `id=?`), values, callback);
  };

  deleteReview = (review_id: number, callback?: SQLCallback): Query =>
    db.query(deleteFrom("review", `id=?`), review_id, callback);
}
