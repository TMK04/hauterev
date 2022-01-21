import { reviews_controller } from "controllers";

import { MergeRouter } from "./utils";

const reviews_router = MergeRouter();

reviews_router.route("/:id").get(reviews_controller.retrieveReview);

export default reviews_router;
