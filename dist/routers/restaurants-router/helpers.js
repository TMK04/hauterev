"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nullInvalidOpeningHours = exports.nullInvalidRegion = void 0;
const helpers_1 = require("routers/utils/helpers");
// --------------------- //
// * validate variants * //
// --------------------- //
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
