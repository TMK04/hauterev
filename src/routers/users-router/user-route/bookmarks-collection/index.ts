import type { UsernameParams } from "../types";
import type { RestaurantIDBody } from "./types";

import users_router from "../../router";
import {
  deleteBookmarkByRestaurantIDnUsername,
  insertBookmark,
  selectBookmarksByUsername
} from "database/schemas";
import { UnauthorizedError } from "routers/utils/Errors";
import { catchNext, simpleNumberValidate } from "routers/utils/helpers";

// ------------------------------ //
// * /users/:username/bookmarks * //
// ------------------------------ //

// *--- POST ---* //

users_router.post<UsernameParams, any, RestaurantIDBody>(
  "/:username/bookmarks",
  ({ body, params }, res, next) =>
    catchNext(async () => {
      const restaurant_id = simpleNumberValidate(body, "restaurant_id");
      await insertBookmark({
        username: params.username,
        restaurant_id,
        timestamp: new Date()
      }).catch(() => {
        throw new UnauthorizedError("Restaurant already bookmarked");
      });
      res.sendStatus(201);
    }, next)
);

// *--- GET ---* //

users_router.get("/:username/bookmarks", ({ params }, res, next) =>
  catchNext(async () => res.json(await selectBookmarksByUsername(params.username)), next)
);

// *--- DELETE ---* //

users_router.delete<UsernameParams, any, RestaurantIDBody>(
  "/:username/bookmarks",
  ({ body, params }, res, next) =>
    catchNext(async () => {
      const restaurant_id = simpleNumberValidate(body, "restaurant_id");
      await deleteBookmarkByRestaurantIDnUsername(restaurant_id, params.username);
      res.sendStatus(204);
    }, next)
);
