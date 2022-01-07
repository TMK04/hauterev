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
exports.rejectUnauthorized = exports.validateRating = void 0;
const __1 = __importDefault(require(".."));
const queries_1 = require("database/queries");
const Errors_1 = require("routers/Errors");
const helpers_1 = require("routers/helpers");
// ----------- //
// * Helpers * //
// ----------- //
// *--- validate variants ---* //
const validateRating = (body) => (0, helpers_1.validate)(body, "rating", (v) => typeof v === "number" && v >= 1 && v <= 5 && v - (v % 0.5));
exports.validateRating = validateRating;
// *--- auth ---* //
/**
 * Reject both unauthenticated & unauthorized requests
 */
const rejectUnauthorized = ({ params }, _, next) => (0, helpers_1.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    const review_id_result = yield (0, queries_1.selectReviewIDByIDnUsername)(+params.id, params.username);
    if (review_id_result[0])
        return next();
    throw new Errors_1.UnauthorizedError("Review belongs to another user");
}), next);
exports.rejectUnauthorized = rejectUnauthorized;
// ---------------------------- //
// * /users/:username/reviews * //
// ---------------------------- //
__1.default.post("/:username/reviews", ({ body, params }, res, next) => (0, helpers_1.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = params;
    const restaurant_id = (0, helpers_1.simpleNumberValidate)(body, "restaurant_id");
    const rating = (0, exports.validateRating)(body);
    const title = (0, helpers_1.simpleStringValidate)(body, "title");
    const description = (0, helpers_1.simpleStringValidate)(body, "description");
    const image_url = (0, helpers_1.simpleStringValidate)(body, "image_url");
    yield (0, queries_1.insertReview)({
        restaurant_id,
        username,
        rating,
        title,
        description,
        image_url,
        posted_timestamp: new Date()
    });
    res.sendStatus(201);
}), next));
// -------------------------------- //
// * /users/:username/reviews/:id * //
// -------------------------------- //
__1.default.use("/:username/reviews/:id", exports.rejectUnauthorized);
// *--- PATCH ---* //
__1.default.patch("/:username/reviews/:id", ({ body, params }, res, next) => (0, helpers_1.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    const { rating, title, description, image_url } = body;
    const update_review = {};
    if ((0, helpers_1.isDefined)(rating))
        update_review.rating = (0, exports.validateRating)(body);
    if ((0, helpers_1.isDefined)(title))
        update_review.title = (0, helpers_1.simpleStringValidate)(body, "title");
    if ((0, helpers_1.isDefined)(description))
        update_review.description = (0, helpers_1.simpleStringValidate)(body, "description");
    if ((0, helpers_1.isDefined)(image_url))
        update_review.image_url = (0, helpers_1.simpleStringValidate)(body, "image_url");
    if ((0, helpers_1.isEmpty)(update_review))
        throw new Errors_1.InvalidError("body");
    yield (0, queries_1.updateReviewByID)(+params.id, update_review, new Date());
    res.sendStatus(205);
}), next));
// *--- DELETE ---* //
__1.default.delete("/:username/reviews/:id", ({ params }, res, next) => (0, helpers_1.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, queries_1.deleteReviewByID)(+params.id);
    res.sendStatus(204);
}), next));
