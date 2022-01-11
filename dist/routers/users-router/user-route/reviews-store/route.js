"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("../../router"));
const schemas_1 = require("database/schemas");
const helpers_1 = require("routers/utils/helpers");
const helpers_2 = require("./helpers");
// ---------------------------- //
// * /users/:username/reviews * //
// ---------------------------- //
router_1.default.post("/:username/reviews", ({ body, params }, res, next) =>
  (0, helpers_1.catchNext)(
    () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const { username } = params;
        const restaurant_id = (0, helpers_1.simpleNumberValidate)(
          body,
          "restaurant_id"
        );
        const rating = (0, helpers_2.validateRating)(body);
        const title = (0, helpers_1.simpleStringValidate)(body, "title");
        const description = (0, helpers_1.simpleStringValidate)(
          body,
          "description"
        );
        const image_url = (0, helpers_1.simpleStringValidate)(
          body,
          "image_url"
        );
        yield (0, schemas_1.insertReview)({
          restaurant_id,
          username,
          rating,
          title,
          description,
          image_url,
          posted_timestamp: new Date(),
        });
        res.sendStatus(201);
      }),
    next
  )
);
