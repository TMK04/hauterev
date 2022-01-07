"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_safe_1 = require("dotenv-safe");
// Initialize environment variables.
(0, dotenv_safe_1.config)();
const configs_1 = require("configs");
const server_1 = __importDefault(require("server"));
const { port, hostname } = configs_1.express_config;
server_1.default.listen(port, hostname, () => console.log(`Listening on http://${hostname}:${port}`));
