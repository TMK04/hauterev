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
// ------------------------------ //
// * /users/:username/bookmarks * //
// ------------------------------ //
// *--- POST ---* //
router_1.default.post("/:username/bookmarks", ({ body, params }, res, next) => (0, helpers_1.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant_id = (0, helpers_1.simpleNumberValidate)(body, "restaurant_id");
    yield (0, schemas_1.insertBookmark)({
        username: params.username,
        restaurant_id,
        timestamp: new Date()
    }).catch(() => {
        throw new Errors_1.UnauthorizedError("Restaurant already bookmarked");
    });
    res.sendStatus(201);
}), next));
// *--- GET ---* //
router_1.default.get("/:username/bookmarks", ({ params }, res, next) => (0, helpers_1.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () { return res.json(yield (0, schemas_1.selectBookmarksByUsername)(params.username)); }), next));
// *--- DELETE ---* //
router_1.default.delete("/:username/bookmarks", ({ body, params }, res, next) => (0, helpers_1.catchNext)(() => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant_id = (0, helpers_1.simpleNumberValidate)(body, "restaurant_id");
    yield (0, schemas_1.deleteBookmarkByRestaurantIDnUsername)(restaurant_id, params.username);
    res.sendStatus(204);
}), next));
