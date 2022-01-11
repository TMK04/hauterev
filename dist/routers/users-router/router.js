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
const bcryptjs_1 = require("bcryptjs");
const express_1 = require("express");
const Errors_1 = require("../utils/Errors");
const helpers_1 = require("../utils/helpers");
const schemas_1 = require("database/schemas");
const helpers_2 = require("./helpers");
const users_router = (0, express_1.Router)();
// ---------------- //
// * /users/login * //
// ---------------- //
// *--- POST ---* //
users_router.post("/login", ({ body }, res, next) =>
  (0, helpers_1.catchNext)(
    () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const username = (0, helpers_1.simpleStringValidate)(body, "username");
        const password = (0, helpers_1.simpleStringValidate)(body, "password");
        const password_hash_result = yield (0,
        schemas_1.selectPasswordHashByUsername)(username);
        if (!password_hash_result[0])
          throw new Errors_1.NotFoundError("User", username);
        const password_hash = password_hash_result[0].password_hash;
        if (yield (0, bcryptjs_1.compare)(password, password_hash))
          return res.sendStatus(200);
        throw new Errors_1.UnauthenticatedError();
      }),
    next
  )
);
// ---------- //
// * /users * //
// ---------- //
// *--- POST ---* //
users_router.post("/", ({ body }, res, next) =>
  (0, helpers_1.catchNext)(
    () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const username = (0, helpers_2.validateUsername)(body);
        const password = (0, helpers_2.validatePassword)(body);
        const password_hash = yield (0, helpers_2.salted_hash)(password);
        const email = (0, helpers_1.simpleStringValidate)(body, "email");
        const last_name = (0, helpers_1.simpleStringValidate)(
          body,
          "last_name"
        );
        const first_name = (0, helpers_1.simpleStringRawDefaultInvalid)(
          body,
          "first_name"
        );
        const mobile_number = (0, helpers_2.rawDefaultInvalidMobileNumber)(
          body
        );
        const address = (0, helpers_1.simpleStringRawDefaultInvalid)(
          body,
          "address"
        );
        const gender = (0, helpers_2.rawDefaultInvalidGender)(body);
        yield (0, schemas_1.insertUser)({
          username,
          password_hash,
          email,
          last_name,
          first_name,
          mobile_number,
          address,
          gender,
          created_timestamp: new Date(),
        });
        res.sendStatus(201);
      }),
    next
  )
);
exports.default = users_router;
