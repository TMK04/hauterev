import { Router } from "express";

import type { IDParams } from "./types";
import type { AuthenticateBody } from "./users-router";

import {
  deleteBookmark,
  insertBookmark,
  selectRestaurantByID,
  selectRestaurants
} from "database/queries";
import { catchNext, rejectUnauthenticated } from "routers/helpers";

const restaurants_router = Router();

// ---------------- //
// * /restaurants * //
// ---------------- //

restaurants_router.get("/", (_, res, next) =>
  catchNext(async () => res.json(await selectRestaurants()), next)
);

// -------------------- //
// * /restaurants/:id * //
// -------------------- //

restaurants_router.get("/:id", ({ params }, res, next) =>
  catchNext(async () => {
    const restaurant_result = await selectRestaurantByID(+params.id);
    if (!restaurant_result[0]) return res.status(404).send("Invalid id");
    res.json(restaurant_result[0]);
  }, next)
);

// ---------------------- //
// * /restaurants/:id/b * //
// ---------------------- //

restaurants_router.use<IDParams, any, Partial<AuthenticateBody>>("/:id/b", rejectUnauthenticated);

restaurants_router.post<IDParams, any, AuthenticateBody>("/:id/b", ({ body, params }, res, next) =>
  catchNext(async () => {
    try {
      await insertBookmark({
        restaurant_id: +params.id,
        username: body.username,
        timestamp: new Date()
      });
    } catch (_) {
      return res.status(403).send("Restaurant already bookmarked");
    }
    res.sendStatus(201);
  }, next)
);

restaurants_router.delete<IDParams, any, AuthenticateBody>(
  "/:id/b",
  ({ body, params }, res, next) =>
    catchNext(async () => {
      await deleteBookmark(body.username, +params.id);
      res.sendStatus(204);
    }, next)
);

export default restaurants_router;
