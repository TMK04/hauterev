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
const Errors_1 = require("routers/utils/Errors");
const helpers_1 = require("routers/utils/helpers");
// ---------------------------------- //
// * /users/:username/helpful-marks * //
// ---------------------------------- //
// *--- POST ---* //
router_1.default.post(
  "/:username/helpful-marks",
  ({ body, params }, res, next) =>
    (0, helpers_1.catchNext)(
      () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const review_id = (0, helpers_1.simpleNumberValidate)(
            body,
            "review_id"
          );
          yield (0, schemas_1.insertHelpfulMark)({
            review_id,
            username: params.username,
          }).catch(() => {
            throw new Errors_1.UnauthorizedError(
              "Review already marked as helpful"
            );
          });
          res.sendStatus(201);
        }),
      next
    )
);
// *--- DELETE ---* //
router_1.default.delete(
  "/:username/helpful-marks",
  ({ body, params }, res, next) =>
    (0, helpers_1.catchNext)(
      () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const review_id = (0, helpers_1.simpleNumberValidate)(
            body,
            "review_id"
          );
          yield (0,
          schemas_1.deleteHelpfulMark)({ review_id, username: params.username });
          res.sendStatus(204);
        }),
      next
    )
);
