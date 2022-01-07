"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.rejectUnauthenticated = exports.authenticate = void 0;
const bcryptjs_1 = require("bcryptjs");
const __1 = __importStar(require(".."));
const queries_1 = require("database/queries");
const Errors_1 = require("routers/Errors");
const helpers_1 = require("routers/helpers");
// ----------- //
// * Helpers * //
// ----------- //
// *--- auth ---* //
/**
 * Check if provided password matches user password,
 * or end the request if no such user exists
 */
const authenticate = ({ body, params }, res, next) => (0, helpers_1.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = params;
    const password_hash_result = yield (0, queries_1.selectPasswordHashByUsername)(username);
    if (!password_hash_result[0])
        throw new Errors_1.NotFoundError("User", username);
    try {
        const password = (0, helpers_1.simpleStringValidate)(body, "password");
        const password_hash = password_hash_result[0].password_hash;
        res.locals.authenticated = yield (0, bcryptjs_1.compare)(password, password_hash);
    }
    catch (_) {
        _;
    }
    finally {
        next();
    }
}), next);
exports.authenticate = authenticate;
/**
 * End the request if res.locals.authentcated is falsy;
 * Is synchronous - no extra error handling is needed
 *
 * @param res - @see resInvalidPassword called if unauthenticated
 * @param next - called if authenticated
 * @see authenticate
 */
const rejectUnauthenticated = (_, res, next) => {
    if (res.locals.authenticated)
        return next();
    throw new Errors_1.UnauthenticatedError();
};
exports.rejectUnauthenticated = rejectUnauthenticated;
// -------------------- //
// * /users/:username * //
// -------------------- //
__1.default.use("/:username", exports.authenticate);
// *--- GET ---* //
__1.default.get("/:username", ({ params }, res, next) => (0, helpers_1.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = params;
    const user_profile_result = yield (res.locals.authenticated
        ? (0, queries_1.selectUserAsUser)(username)
        : (0, queries_1.selectUserByUsername)(username));
    const user_profile = user_profile_result[0];
    if (!user_profile)
        throw new Errors_1.NotFoundError("User", username);
    res.json(user_profile);
}), next));
// *--- PATCH ---* //
__1.default.patch("/:username", exports.rejectUnauthenticated, ({ body, params }, res, next) => (0, helpers_1.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    const { username, new_password, email, last_name, first_name, mobile_number, address, gender } = body;
    const update_user = {};
    if ((0, helpers_1.isDefined)(username))
        update_user.username = (0, __1.validateUsername)(body);
    if ((0, helpers_1.isDefined)(new_password))
        update_user.password_hash = yield (0, __1.salted_hash)((0, __1.validatePassword)(body, "new_password"));
    if ((0, helpers_1.isDefined)(email))
        update_user.email = (0, helpers_1.simpleStringValidate)(body, "email");
    if ((0, helpers_1.isDefined)(last_name))
        update_user.last_name = (0, helpers_1.simpleStringValidate)(body, "last_name");
    if ((0, helpers_1.isDefined)(first_name))
        update_user.first_name = (0, helpers_1.simpleStringRawDefaultInvalid)(body, "first_name");
    if ((0, helpers_1.isDefined)(mobile_number))
        update_user.mobile_number = (0, __1.rawDefaultInvalidMobileNumber)(body);
    if ((0, helpers_1.isDefined)(address))
        update_user.address = (0, helpers_1.simpleStringRawDefaultInvalid)(body, "address");
    if ((0, helpers_1.isDefined)(gender))
        update_user.gender = (0, __1.rawDefaultInvalidGender)(body);
    if ((0, helpers_1.isEmpty)(update_user))
        throw new Errors_1.InvalidError("body");
    yield (0, queries_1.updateUserByUsername)(params.username, update_user);
    res.sendStatus(205);
}), next));
// *--- DELETE ---* //
__1.default.delete("/:username", exports.rejectUnauthenticated, ({ params }, res, next) => (0, helpers_1.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, queries_1.deleteUserByUsername)(params.username);
    res.sendStatus(204);
}), next));
// --------------------------- //
// * /users/:username/:route * //
// --------------------------- //
__1.default.use("/:username/:route", exports.rejectUnauthenticated);
require("./reviews-store");
require("./bookmarks-collection");
require("./helpful-marks-collection");
