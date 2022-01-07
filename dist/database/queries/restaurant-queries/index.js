"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectRestaurantByID = exports.selectRestaurants = void 0;
const __1 = require("..");
const database_1 = __importDefault(require("database"));
// ----------- //
// * Helpers * //
// ----------- //
const restaurantTable = () => (0, database_1.default)("restaurant");
// ----------- //
// * Queries * //
// ----------- //
// *--- Select ---* //
const selectRestaurants = ({ opening_hours, rating, region, search }) => {
    let query = restaurantTable()
        .select("restaurant.id", "restaurant.name AS name", database_1.default.raw(`CONCAT(LEFT(restaurant.description, 197), "...") AS description`), "restaurant.image_url", "restaurant.region", "restaurant.opening_hours", "avg_rating.avg_rating")
        .leftJoin((0, __1.selectAvgRating)(), "restaurant.id", "avg_rating.restaurant_id");
    if (search)
        query = query.andWhereRaw("MATCH (name, description) AGAINST (? IN NATURAL LANGUAGE MODE)", search);
    if (rating)
        query = query.andWhere("avg_rating.avg_rating", ">=", rating);
    if (region)
        query = query.andWhere("restaurant.region", region);
    if (opening_hours)
        query = query.andWhereRaw("(restaurant.opening_hours & ?) > 0", opening_hours);
    return query;
};
exports.selectRestaurants = selectRestaurants;
const selectRestaurantByID = (id) => restaurantTable()
    .select("restaurant.*", "reviews.avg_rating", "reviews.reviews")
    .leftJoin((0, __1.selectReviewsByRestaurantID)(id), "restaurant.id", "reviews.restaurant_id")
    .where({ "restaurant.id": id });
exports.selectRestaurantByID = selectRestaurantByID;
