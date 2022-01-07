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
exports.nullInvalidOpeningHours = exports.nullInvalidRegion = void 0;
const express_1 = require("express");
const queries_1 = require("database/queries");
const Errors_1 = require("routers/Errors");
const helpers_1 = require("routers/helpers");
const restaurants_router = (0, express_1.Router)();
// ----------- //
// * Helpers * //
// ----------- //
// *--- validate variants ---* //
const restaurant_regions = [
    "North",
    "South",
    "East",
    "West",
    "Central"
];
const nullInvalidRegion = (query) => (0, helpers_1.nullInvalid)(query, "region", (v) => restaurant_regions.includes(v) && v);
exports.nullInvalidRegion = nullInvalidRegion;
const nullInvalidOpeningHours = (query) => (0, helpers_1.nullInvalid)(query, "opening_hours", (v) => {
    if (!v)
        return;
    v = parseInt(v, 2);
    if (isFinite(v))
        return v;
});
exports.nullInvalidOpeningHours = nullInvalidOpeningHours;
// ---------------- //
// * /restaurants * //
// ---------------- //
// *--- GET ---* //
restaurants_router.get("/", ({ query }, res, next) => (0, helpers_1.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    const search = (0, helpers_1.simpleStringNullInvalid)(query, "search");
    const rating = (0, helpers_1.simpleNumberNullInvalid)(query, "rating");
    const region = (0, exports.nullInvalidRegion)(query);
    const opening_hours = (0, exports.nullInvalidOpeningHours)(query);
    res.json(yield (0, queries_1.selectRestaurants)({ search, rating, region, opening_hours }));
}), next));
// -------------------- //
// * /restaurants/:id * //
// -------------------- //
// *--- GET ---* //
restaurants_router.get(`/:id`, ({ params }, res, next) => (0, helpers_1.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = params;
    const restaurant_result = yield (0, queries_1.selectRestaurantByID)(+id);
    if (!restaurant_result[0])
        throw new Errors_1.NotFoundError("Restaurant", id);
    res.json(restaurant_result[0]);
}), next));
exports.default = restaurants_router;
