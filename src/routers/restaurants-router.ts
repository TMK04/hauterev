import { Router } from "express";

import { selectRestaurantByID, selectRestaurants } from "database/queries";
import { catchNext } from "routers/helpers";

const restaurants_router = Router();

restaurants_router.get("/", (_, res, next) =>
  catchNext(async () => res.json(await selectRestaurants()), next)
);

restaurants_router.get("/:id", ({ params }, res, next) =>
  catchNext(async () => {
    const restaurant_result = await selectRestaurantByID(+params.id);
    if (!restaurant_result[0]) return res.status(404).send("Invalid id");
    res.json(restaurant_result[0]);
  }, next)
);

export default restaurants_router;
