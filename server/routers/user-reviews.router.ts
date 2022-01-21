import { user_reviews_store } from "controllers";
import { user_reviews_middlewares } from "middlewares";

import MergeRouter from "./utils/MergeRouter";

const user_reviews_router = MergeRouter();

user_reviews_router.route("/").post(user_reviews_store.createReview);

user_reviews_router
  .use("/:id", user_reviews_middlewares.rejectUnauthorized)
  .route("/:id")
  .patch(user_reviews_store.updateReview)
  .delete(user_reviews_store.deleteReview);

export default user_reviews_router;
