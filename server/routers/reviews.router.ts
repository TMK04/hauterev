import { reviews_controller } from "controllers";

import { MergeRouter } from "./utils";

const reviews_router = MergeRouter();

reviews_router.route("/").get(reviews_controller.retrieveReviews);

reviews_router.route("/most-helpful").get(reviews_controller.retrieveMostHelpfulReviews);

reviews_router.route("/:id").get(reviews_controller.retrieveReview);

export default reviews_router;
