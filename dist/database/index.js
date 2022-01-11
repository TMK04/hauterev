"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = require("knex");
const configs_1 = require("configs");
const db = (0, knex_1.knex)({
  client: "mysql2",
  connection: configs_1.mysql_config,
});
exports.default = db;
