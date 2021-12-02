import { Router } from "express";

import { PostReview, EditReview } from "models/Review";
import ReviewsDB from "models/ReviewsDB";

const review_router = Router();

const reviewsDB = new ReviewsDB();

review_router.get("/", (_, res) =>
  reviewsDB.getAllReviews((err, result) => res.json(err ?? result))
);

review_router.get("/:id", (req, res) =>
  reviewsDB.getReview(+req.params.id, (err, result) => res.json(err ?? result))
);

review_router.post("/", (req, res) => {
  const { restaurant_id, username, rating, title, description, image_url } = <PostReview>req.body;
  const review = new PostReview(restaurant_id, username, rating, title, description, image_url);

  return reviewsDB.postReview(review, (err, result) => res.json(err ?? result));
});

review_router.put("/:id", (req, res) => {
  const { rating, title, description, image_url } = <EditReview>req.body;
  const review = new EditReview(+req.params.id, rating, title, description, image_url);

  return reviewsDB.editReview(review, (err, result) => res.json(err ?? result));
});

review_router.delete("/:id", (req, res) =>
  reviewsDB.deleteReview(+req.params.id, (err, result) => res.json(err ?? result))
);

export default review_router;
