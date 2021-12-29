import { Router } from "express";

import type { GetRestaurantsQuery } from "./types";

import { selectRestaurants } from "database/schemas";
import { catchNext, simpleStringNullInvalid } from "routers/utils/helpers";

import { nullInvalidOpeningHours, nullInvalidRegion } from "./helpers";

const restaurants_router = Router();

// ---------------- //
// * /restaurants * //
// ---------------- //

// *--- GET ---* //

restaurants_router.get<any, any, any, any, GetRestaurantsQuery>("/", ({ query }, res, next) =>
  catchNext(async () => {
    const search = simpleStringNullInvalid(query, "search");
    const region = nullInvalidRegion(query);
    const opening_hours = nullInvalidOpeningHours(query);
    res.json(await selectRestaurants({ search, region, opening_hours }).catch(console.log));
  }, next)
);

export default restaurants_router;
