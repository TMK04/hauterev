import { Router } from "express";

import { restaurants_controller } from "controllers";

const restaurants_router = Router();

restaurants_router.route("/").get(restaurants_controller.retrieveRestaurants);

restaurants_router.route("/top-rated").get(restaurants_controller.retrieveTopRatedRestaurants);

restaurants_router.route("/:id").get(restaurants_controller.retrieveRestaurant);

export default restaurants_router;
