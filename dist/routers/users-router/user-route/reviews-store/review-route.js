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
const router_1 = __importDefault(require("../../router"));
const schemas_1 = require("database/schemas");
const Errors_1 = require("routers/utils/Errors");
const helpers_1 = require("routers/utils/helpers");
const helpers_2 = require("./helpers");
// -------------------------------- //
// * /users/:username/reviews/:id * //
// -------------------------------- //
// *--- PATCH ---* //
router_1.default.patch("/:username/reviews/:id", ({ body, params }, res, next) => (0, helpers_1.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    const { rating, title, description, image_url } = body;
    const update_review = {};
    if ((0, helpers_1.isDefined)(rating))
        update_review.rating = (0, helpers_2.validateRating)(body);
    if ((0, helpers_1.isDefined)(title))
        update_review.title = (0, helpers_1.simpleStringValidate)(body, "title");
    if ((0, helpers_1.isDefined)(description))
        update_review.description = (0, helpers_1.simpleStringValidate)(body, "description");
    if ((0, helpers_1.isDefined)(image_url))
        update_review.image_url = (0, helpers_1.simpleStringValidate)(body, "image_url");
    if ((0, helpers_1.isEmpty)(update_review))
        throw new Errors_1.InvalidError("body");
    yield (0, schemas_1.updateReviewByID)(+params.id, update_review, new Date());
    res.sendStatus(205);
}), next));
// *--- DELETE ---* //
router_1.default.delete("/:username/reviews/:id", ({ params }, res, next) => (0, helpers_1.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, schemas_1.deleteReviewByID)(+params.id);
    res.sendStatus(204);
}), next));
