import express, { static as serve } from "express";

import { express_config } from "configs";

const { port, hostname } = express_config;

const server = express();

server.use(serve("public")).listen(port, hostname);
