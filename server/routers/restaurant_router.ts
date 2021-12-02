import { Router } from "express";

import RestaurantsDB from "models/RestaurantsDB";

const restaurant_router = Router();

const restaurantsDB = new RestaurantsDB();

restaurant_router.get("/", (_, res) =>
  restaurantsDB.getAllRestaurants((err, result) => res.json(err ?? result))
);

export default restaurant_router;
