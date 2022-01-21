import { Router } from "express";

import { users_controller } from "controllers";
import { users_middlewares } from "middlewares";

import user_bookmarks_router from "./user-bookmarks.router";
import user_helpful_marks_router from "./user-helpful-marks.router";
import user_reviews_router from "./user-reviews.router";

const users_router = Router();

users_router.route("/").post(users_controller.createUser);

users_router.route("/login").post(users_controller.login);

users_router
  .use("/:username", users_middlewares.authenticate)
  .route("/:username")
  .get(users_controller.retrieveUser)
  .patch(users_middlewares.rejectUnauthenticated, users_controller.updateUser)
  .delete(users_middlewares.rejectUnauthenticated, users_controller.deleteUser);

users_router
  .use("/:username/:route", users_middlewares.rejectUnauthenticated)
  .use("/:username/bookmarks", user_bookmarks_router)
  .use("/:username/helpful-marks", user_helpful_marks_router)
  .use("/:username/reviews", user_reviews_router);

export default users_router;
