import express, { static as serve } from "express";

const server = express();

server.use(serve("public"));

export default server;
