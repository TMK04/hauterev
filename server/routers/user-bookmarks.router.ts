import { user_bookmarks_collection } from "controllers";

import MergeRouter from "./utils/MergeRouter";

const user_bookmarks_router = MergeRouter();

user_bookmarks_router
  .route("/")
  .post(user_bookmarks_collection.bookmark)
  .get(user_bookmarks_collection.retrieveBookmarks)
  .delete(user_bookmarks_collection.unbookmark);

export default user_bookmarks_router;
