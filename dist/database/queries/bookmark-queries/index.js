"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBookmarkByRestaurantIDnUsername = exports.selectBookmarksByUsername = exports.insertBookmark = void 0;
const database_1 = __importDefault(require("database"));
// ----------- //
// * Helpers * //
// ----------- //
const bookmarkTable = () => (0, database_1.default)("bookmark");
// ----------- //
// * Queries * //
// ----------- //
// *--- Insert ---* //
const insertBookmark = (bookmark) => bookmarkTable().insert(bookmark);
exports.insertBookmark = insertBookmark;
// *--- Select ---* //
const selectBookmarksByUsername = (username) => bookmarkTable().select().where({ username });
exports.selectBookmarksByUsername = selectBookmarksByUsername;
// *--- Delete ---* //
const deleteBookmarkByRestaurantIDnUsername = (restaurant_id, username) => bookmarkTable().del().where({ username, restaurant_id });
exports.deleteBookmarkByRestaurantIDnUsername = deleteBookmarkByRestaurantIDnUsername;
