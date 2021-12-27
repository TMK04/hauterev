import { json, urlencoded } from "body-parser";
import express, { ErrorRequestHandler, static as serve } from "express";

import NextError from "NextError";
import { restaurants_router, review_router, users_router } from "routers";

const server = express();

// Setup
server
  .use(urlencoded({ extended: true }))
  .use(json())
  .use(serve("public"));

// Routers
server
  .use("/restaurants", restaurants_router)
  .use("/users", users_router)
  .use("/reviews/:id", review_router);

// NextError Handling
server.use(<ErrorRequestHandler>((err, _, res, next) => {
  if (err instanceof NextError) {
    const { status_code, message } = err;
    return res.status(status_code).send(message);
  }
  if (err instanceof Error) return res.status(500).send(err.name);
  next(err);
}));

export default server;
