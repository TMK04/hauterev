import { Router } from "express";

import type { GetRestaurantsQuery } from "./types";

import { selectRestaurants } from "database/schemas";
import { catchNext, simpleNumberNullInvalid, simpleStringNullInvalid } from "routers/utils/helpers";

import { nullInvalidOpeningHours, nullInvalidRegion } from "./helpers";

const restaurants_router = Router();

// ---------------- //
// * /restaurants * //
// ---------------- //

// *--- GET ---* //

restaurants_router.get<any, any, any, any, GetRestaurantsQuery>("/", ({ query }, res, next) =>
  catchNext(async () => {
    const search = simpleStringNullInvalid(query, "search");
    const rating = simpleNumberNullInvalid(query, "rating");
    const region = nullInvalidRegion(query);
    const opening_hours = nullInvalidOpeningHours(query);
    res.json(await selectRestaurants({ search, rating, region, opening_hours }));
  }, next)
);

export default restaurants_router;
