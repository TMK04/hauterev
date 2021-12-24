import { Router } from "express";

import { selectRestaurants } from "database/queries";

const restaurants_router = Router();

restaurants_router.get("/", async (_, res) => res.json(await selectRestaurants()));

export default restaurants_router;
