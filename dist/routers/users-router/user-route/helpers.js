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
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectUnauthenticated = exports.authenticate = void 0;
const bcryptjs_1 = require("bcryptjs");
const schemas_1 = require("database/schemas");
const Errors_1 = require("routers/utils/Errors");
const helpers_1 = require("routers/utils/helpers");
// -------- //
// * auth * //
// -------- //
/**
 * Check if provided password matches user password,
 * or end the request if no such user exists
 */
const authenticate = ({ body, params }, res, next) =>
  (0, helpers_1.catchNext)(
    () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const { username } = params;
        const password_hash_result = yield (0,
        schemas_1.selectPasswordHashByUsername)(username);
        if (!password_hash_result[0])
          throw new Errors_1.NotFoundError("User", username);
        try {
          const password = (0, helpers_1.simpleStringValidate)(
            body,
            "password"
          );
          const password_hash = password_hash_result[0].password_hash;
          res.locals.authenticated = yield (0, bcryptjs_1.compare)(
            password,
            password_hash
          );
        } catch (_) {
          _;
        } finally {
          next();
        }
      }),
    next
  );
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
  if (res.locals.authenticated) return next();
  throw new Errors_1.UnauthenticatedError();
};
exports.rejectUnauthenticated = rejectUnauthenticated;
