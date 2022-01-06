import type { UsernameParams } from ".";
import type { UnknownRecord } from "routers/types";

import users_router from "..";
import {
  deleteBookmarkByRestaurantIDnUsername,
  insertBookmark,
  selectBookmarksByUsername
} from "database/queries";
import { UnauthorizedError } from "routers/Errors";
import { catchNext, simpleNumberValidate } from "routers/helpers";

// --------- //
// * Types * //
// --------- //

type RestaurantIDBody = UnknownRecord<"restaurant_id">;

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
