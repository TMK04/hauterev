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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserByUsername = exports.updateUserByUsername = exports.selectUserAsUser = exports.selectUserByUsername = exports.selectPasswordHashByUsername = exports.insertUser = void 0;
const database_1 = __importDefault(require("database"));
// ----------- //
// * Helpers * //
// ----------- //
const userSchema = () => (0, database_1.default)("user");
const user = (username) => userSchema().where({ username });
// ----------- //
// * Queries * //
// ----------- //
// *--- Insert ---* //
const insertUser = (insert_user) => __awaiter(void 0, void 0, void 0, function* () { return userSchema().insert(insert_user); });
exports.insertUser = insertUser;
// *--- Select ---* //
const selectPasswordHashByUsername = (username) => user(username).select("password_hash");
exports.selectPasswordHashByUsername = selectPasswordHashByUsername;
const user_columns_bu = [
    "email",
    "first_name",
    "last_name",
    "gender",
    "created_timestamp"
];
const selectUserByUsername = (username) => user(username).select(...user_columns_bu);
exports.selectUserByUsername = selectUserByUsername;
const user_columns_au = ["mobile_number", "address", ...user_columns_bu];
const selectUserAsUser = (username) => user(username).select(...user_columns_au);
exports.selectUserAsUser = selectUserAsUser;
const updateUserByUsername = (username, update_user) => user(username).update(update_user);
exports.updateUserByUsername = updateUserByUsername;
// *--- Delete ---* //
const deleteUserByUsername = (username) => user(username).del();
exports.deleteUserByUsername = deleteUserByUsername;
