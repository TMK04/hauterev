import { user_helpful_marks_collection } from "controllers";

import MergeRouter from "./utils/MergeRouter";

const user_helpful_marks_router = MergeRouter();

user_helpful_marks_router
  .route("/")
  .post(user_helpful_marks_collection.markAsHelpful)
  .get(user_helpful_marks_collection.retrieveHelpfulMarks)
  .delete(user_helpful_marks_collection.unmarkAsHelpful);

export default user_helpful_marks_router;
