import { Router } from "express";

import restaurants_router from "./restaurants.router";
import reviews_router from "./reviews.router";
import users_router from "./users.router";

const api_router = Router();

api_router
  .use("/restaurants", restaurants_router)
  .use("/reviews", reviews_router)
  .use("/users", users_router);

export default api_router;
