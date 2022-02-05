import type { GetRestaurantsQuery, IDParams } from "../types";
import type { RequestHandler } from "express";

import { NotFoundError } from "Errors";
import { restaurant_db } from "db";
import { catchNext } from "helpers";
import { castGetRestaurantsQuery } from "validation";

export const retrieveRestaurants: RequestHandler<any, any, any, GetRestaurantsQuery> = (
  { query },
  res,
  next
) =>
  catchNext(
    async () =>
      res.json(await restaurant_db.selectRestaurantsWithOptions(castGetRestaurantsQuery(query))),
    next
  );

export const retrieveTopRatedRestaurants: RequestHandler = (_, res, next) =>
  catchNext(async () => res.json(await restaurant_db.selectTopRatedRestaurants()), next);

export const retrieveRestaurant: RequestHandler<IDParams> = ({ params }, res, next) =>
  catchNext(async () => {
    const { id } = params;
    const restaurant_result = await restaurant_db.selectRestaurantByID(+id);
    if (!restaurant_result[0]) throw new NotFoundError("Restaurant", id);
    res.json(restaurant_result[0]);
  }, next);
