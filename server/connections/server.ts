import { json, urlencoded } from "body-parser";
import express, { ErrorRequestHandler, static as serve } from "express";

import NextError from "Errors/NextError";
import api_router from "routers/api.router";

const server = express();

// Setup
server.use(urlencoded({ extended: true })).use(json());

// API
server.use("/api", api_router);

// NextError Handling
server.use(<ErrorRequestHandler>((err, _, res, next) => {
  console.log(err);
  if (err instanceof NextError) {
    const { status_code, message } = err;
    return res.status(status_code).send(message);
  }
  if (err instanceof Error) return res.status(500).send(err.name);
  next(err);
}));

server.use(serve("public"));

export default server;
