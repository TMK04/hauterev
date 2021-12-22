import { Router } from "express";

import { getRestaurants } from "database/queries";

const restaurants_router = Router();

restaurants_router.get("/", async (_, res) => res.json(await getRestaurants()));

export default restaurants_router;
