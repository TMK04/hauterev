import type { RestaurantIDBody, UsernameParams } from "../types";
import type { RequestHandler } from "express";

import { UnauthorizedError } from "Errors";
import { bookmark_db } from "db";
import { catchNext } from "helpers";
import { validateRestaurantIDBody } from "validation";

export const bookmark: RequestHandler<UsernameParams, any, RestaurantIDBody> = (
  { body, params },
  res,
  next
) =>
  catchNext(async () => {
    const { restaurant_id } = validateRestaurantIDBody(body);
    await bookmark_db
      .insertBookmark({
        username: params.username,
        restaurant_id,
        timestamp: new Date()
      })
      .catch(() => {
        throw new UnauthorizedError("Restaurant already bookmarked");
      });
    res.sendStatus(201);
  }, next);

export const retrieveBookmarks: RequestHandler<UsernameParams> = ({ params }, res, next) =>
  catchNext(
    async () => res.json(await bookmark_db.selectBookmarksByUsername(params.username)),
    next
  );

export const unbookmark: RequestHandler<UsernameParams, any, RestaurantIDBody> = (
  { body, params },
  res,
  next
) =>
  catchNext(async () => {
    const { restaurant_id } = validateRestaurantIDBody(body);
    await bookmark_db.deleteBookmarkByRestaurantIDnUsername(restaurant_id, params.username);
    res.sendStatus(204);
  }, next);
