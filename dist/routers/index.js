"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.users_router =
  exports.review_router =
  exports.restaurants_router =
    void 0;
const restaurants_router_1 = __importDefault(require("./restaurants-router"));
exports.restaurants_router = restaurants_router_1.default;
const review_route_1 = __importDefault(require("./review-route"));
exports.review_router = review_route_1.default;
const users_router_1 = __importDefault(require("./users-router"));
exports.users_router = users_router_1.default;
