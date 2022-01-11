"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = require("body-parser");
const express_1 = __importStar(require("express"));
const NextError_1 = __importDefault(require("NextError"));
const routers_1 = require("routers");
const server = (0, express_1.default)();
// Setup
server
  .use((0, body_parser_1.urlencoded)({ extended: true }))
  .use((0, body_parser_1.json)())
  .use((0, express_1.static)("public"));
// Routers
server
  .use("/restaurants", routers_1.restaurants_router)
  .use("/users", routers_1.users_router)
  .use("/reviews/:id", routers_1.review_router);
// NextError Handling
server.use((err, _, res, next) => {
  if (err instanceof NextError_1.default) {
    const { status_code, message } = err;
    return res.status(status_code).send(message);
  }
  if (err instanceof Error) return res.status(500).send(err.name);
  next(err);
});
exports.default = server;
