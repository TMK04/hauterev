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
const helpers_1 = require("../helpers");
const router_1 = __importDefault(require("../router"));
const schemas_1 = require("database/schemas");
const Errors_1 = require("routers/utils/Errors");
const helpers_2 = require("routers/utils/helpers");
const helpers_3 = require("./helpers");
// -------------------- //
// * /users/:username * //
// -------------------- //
// *--- GET ---* //
router_1.default.get("/:username", ({ params }, res, next) => (0, helpers_2.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = params;
    const user_profile_result = yield (res.locals.authenticated
        ? (0, schemas_1.selectUserAsUser)(username)
        : (0, schemas_1.selectUserByUsername)(username));
    const user_profile = user_profile_result[0];
    if (!user_profile)
        throw new Errors_1.NotFoundError("User", username);
    res.json(user_profile);
}), next));
// *--- PATCH ---* //
router_1.default.patch("/:username", helpers_3.rejectUnauthenticated, ({ body, params }, res, next) => (0, helpers_2.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    const { username, new_password, email, last_name, first_name, mobile_number, address, gender } = body;
    const update_user = {};
    if ((0, helpers_2.isDefined)(username))
        update_user.username = (0, helpers_1.validateUsername)(body);
    if ((0, helpers_2.isDefined)(new_password))
        update_user.password_hash = yield (0, helpers_1.salted_hash)((0, helpers_1.validatePassword)(body, "new_password"));
    if ((0, helpers_2.isDefined)(email))
        update_user.email = (0, helpers_2.simpleStringValidate)(body, "email");
    if ((0, helpers_2.isDefined)(last_name))
        update_user.last_name = (0, helpers_2.simpleStringValidate)(body, "last_name");
    if ((0, helpers_2.isDefined)(first_name))
        update_user.first_name = (0, helpers_2.simpleStringRawDefaultInvalid)(body, "first_name");
    if ((0, helpers_2.isDefined)(mobile_number))
        update_user.mobile_number = (0, helpers_1.rawDefaultInvalidMobileNumber)(body);
    if ((0, helpers_2.isDefined)(address))
        update_user.address = (0, helpers_2.simpleStringRawDefaultInvalid)(body, "address");
    if ((0, helpers_2.isDefined)(gender))
        update_user.gender = (0, helpers_1.rawDefaultInvalidGender)(body);
    if ((0, helpers_2.isEmpty)(update_user))
        throw new Errors_1.InvalidError("body");
    yield (0, schemas_1.updateUserByUsername)(params.username, update_user);
    res.sendStatus(205);
}), next));
// *--- DELETE ---* //
router_1.default.delete("/:username", helpers_3.rejectUnauthenticated, ({ params }, res, next) => (0, helpers_2.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, schemas_1.deleteUserByUsername)(params.username);
    res.sendStatus(204);
}), next));
