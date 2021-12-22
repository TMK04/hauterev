import { json, urlencoded } from "body-parser";
import express, { ErrorRequestHandler, static as serve } from "express";

import { restaurants_router, users_router } from "routers";

const server = express();

// Setup
server
  .use(urlencoded({ extended: true }))
  .use(json())
  .use(serve("public"));

// Routers
server.use("/restaurants", restaurants_router).use("/users", users_router);

// Default Error Handling
server.use(<ErrorRequestHandler>((err, _, res) => res.status(500).send(err)));

export default server;
