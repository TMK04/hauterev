import { json, urlencoded } from "body-parser";
import express, { ErrorRequestHandler, static as serve } from "express";

import NextError from "NextError";
import { restaurants_router, reviews_router, users_router } from "routers";

const server = express();

// Setup
server
  .use(urlencoded({ extended: true }))
  .use(json())
  .use(serve("public"));

// Routers
server
  .use("/restaurants", restaurants_router)
  .use("/reviews", reviews_router)
  .use("/users", users_router);

// NextError Handling
server.use(<ErrorRequestHandler>((err, _, res, next) => {
  if (err instanceof NextError) {
    const { status_code, message } = err;
    return res.status(status_code).send(message);
  }
  next(err);
}));

export default server;
