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
exports.rejectUnauthorized = exports.validateRating = void 0;
const schemas_1 = require("database/schemas");
const Errors_1 = require("routers/utils/Errors");
const helpers_1 = require("routers/utils/helpers");
// ---------------------------- //
// * validate Implementations * //
// ---------------------------- //
const validateRating = (body) => (0, helpers_1.validate)(body, "rating", (v) => typeof v === "number" && v >= 1 && v <= 5 && v - (v % 0.5));
exports.validateRating = validateRating;
// -------- //
// * auth * //
// -------- //
/**
 * Reject both unauthenticated & unauthorized requests
 */
const rejectUnauthorized = ({ params }, _, next) => (0, helpers_1.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    const review_id_result = yield (0, schemas_1.selectReviewIDByIDnUsername)(+params.id, params.username);
    if (review_id_result[0])
        return next();
    throw new Errors_1.UnauthorizedError("Review belongs to another user");
}), next);
exports.rejectUnauthorized = rejectUnauthorized;
