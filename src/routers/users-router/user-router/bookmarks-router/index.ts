import type { UsernameParams } from "../types";
import type { UnknownRecord } from "routers/utils/types";

import {
  deleteBookmarkByRestaurantIDnUsername,
  insertBookmark,
  selectBookmarksByUsername
} from "database/schemas";
import { UnauthorizedError } from "routers/utils/Errors";
import { catchNext, mergeRouter, simpleNumberValidate } from "routers/utils/helpers";

const bookmarks_router = mergeRouter();

// *--- Types ---* //

type RestaurantIDBody = UnknownRecord<"restaurant_id">;

// ----- //
// * / * //
// ----- //

// *--- POST ---* //

bookmarks_router.post<UsernameParams, any, RestaurantIDBody>("/", ({ body, params }, res, next) =>
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

bookmarks_router.get<UsernameParams>("/", ({ params }, res, next) =>
  catchNext(async () => res.json(await selectBookmarksByUsername(params.username)), next)
);

// *--- DELETE ---* //

bookmarks_router.delete<UsernameParams, any, RestaurantIDBody>("/", ({ body, params }, res, next) =>
  catchNext(async () => {
    const restaurant_id = simpleNumberValidate(body, "restaurant_id");
    await deleteBookmarkByRestaurantIDnUsername(restaurant_id, params.username);
    res.sendStatus(204);
  }, next)
);

export default bookmarks_router;
