import { Router } from "express";

import { selectRestaurantByID, selectRestaurants } from "database/schemas";

import { InvalidError } from "./utils/Errors";
import { catchNext } from "./utils/helpers";

const restaurants_router = Router();

// ---------- //
// * Routes * //
// ---------- //

// *--- /restaurants ---* //

restaurants_router.get("/", (_, res, next) =>
  catchNext(async () => res.json(await selectRestaurants()), next)
);

// *--- /restaurants/:id ---* //

restaurants_router.get(`/:id`, ({ params }, res, next) =>
  catchNext(async () => {
    const restaurant_result = await selectRestaurantByID(+params.id);
    if (!restaurant_result[0]) return next(new InvalidError("id"));
    res.json(restaurant_result[0]);
  }, next)
);

export default restaurants_router;
