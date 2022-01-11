"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("../../router"));
const helpers_1 = require("./helpers");
require("./route");
router_1.default.use("/:username/reviews/:id", helpers_1.rejectUnauthorized);
require("./review-route");
