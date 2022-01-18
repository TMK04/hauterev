import { Router } from "express";

import type { RestaurantRegion, SelectRestaurantsOptions } from "database/queries/types";
import type { QueryRecord } from "routers/utils/types";

import {
  selectRandomRestaurants,
  selectRestaurantByID,
  selectRestaurantsWithOptions
} from "database/queries";
import { NotFoundError } from "routers/utils/Errors";
import {
  catchNext,
  nullInvalid,
  simpleNumberNullInvalid,
  simpleStringNullInvalid
} from "routers/utils/helpers";

const restaurants_router = Router();

// --------- //
// * Types * //
// --------- //

type GetRestaurantsQuery = {
  [K in keyof SelectRestaurantsOptions]-?: QueryRecord<K>[K];
};

// ----------- //
// * Helpers * //
// ----------- //

// *--- validate variants ---* //

const restaurant_regions: readonly RestaurantRegion[] = [
  "North",
  "South",
  "East",
  "West",
  "Central"
];

export const nullInvalidRegion = <T extends QueryRecord<"region">>(query: T) =>
  nullInvalid(query, "region", (v: any) => restaurant_regions.includes(v) && <RestaurantRegion>v);

export const nullInvalidOpeningHours = <T extends QueryRecord<"opening_hours">>(query: T) =>
  nullInvalid(query, "opening_hours", (v: any) => {
    if (!v) return;
    v = parseInt(v, 2);
    if (isFinite(v)) return v;
  });

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
    res.json(await selectRestaurantsWithOptions({ search, rating, region, opening_hours }));
  }, next)
);

// ----------------------- //
// * /restaurants/random * //
// ----------------------- //

// *--- GET ---* //

restaurants_router.get<any, any, any, any, GetRestaurantsQuery>("/random", (_, res, next) =>
  catchNext(async () => res.json(await selectRandomRestaurants()), next)
);

// -------------------- //
// * /restaurants/:id * //
// -------------------- //

// *--- GET ---* //

restaurants_router.get(`/:id`, ({ params }, res, next) =>
  catchNext(async () => {
    const { id } = params;
    const restaurant_result = await selectRestaurantByID(+id);
    if (!restaurant_result[0]) throw new NotFoundError("Restaurant", id);
    res.json(restaurant_result[0]);
  }, next)
);

export default restaurants_router;
