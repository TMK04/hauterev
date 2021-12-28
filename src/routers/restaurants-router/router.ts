import { Router } from "express";

import { selectRestaurants } from "database/schemas";
import { catchNext } from "routers/utils/helpers";

const restaurants_router = Router();

// ---------------- //
// * /restaurants * //
// ---------------- //

// *--- GET ---* //

restaurants_router.get("/", (_, res, next) =>
  catchNext(async () => res.json(await selectRestaurants()), next)
);

export default restaurants_router;
