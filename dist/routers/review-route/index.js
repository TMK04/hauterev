"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const queries_1 = require("database/queries");
const Errors_1 = require("routers/Errors");
const helpers_1 = require("routers/helpers");
const review_router = (0, express_1.Router)({ mergeParams: true });
// *--- GET ---* //
review_router.get("/", ({ params }, res, next) =>
  (0, helpers_1.catchNext)(
    () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const { id } = params;
        const review_result = yield (0, queries_1.selectReviewByID)(+id);
        const review = review_result[0];
        if (!review) throw new Errors_1.NotFoundError("Review", id);
        res.json(review);
      }),
    next
  )
);
exports.default = review_router;
