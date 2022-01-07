"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schemas_1 = require("database/schemas");
const helpers_1 = require("routers/utils/helpers");
const helpers_2 = require("./helpers");
const restaurants_router = (0, express_1.Router)();
// ---------------- //
// * /restaurants * //
// ---------------- //
// *--- GET ---* //
restaurants_router.get("/", ({ query }, res, next) => (0, helpers_1.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    const search = (0, helpers_1.simpleStringNullInvalid)(query, "search");
    const rating = (0, helpers_1.simpleNumberNullInvalid)(query, "rating");
    const region = (0, helpers_2.nullInvalidRegion)(query);
    const opening_hours = (0, helpers_2.nullInvalidOpeningHours)(query);
    res.json(yield (0, schemas_1.selectRestaurants)({ search, rating, region, opening_hours }));
}), next));
exports.default = restaurants_router;
