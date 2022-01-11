"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawDefaultInvalidGender =
  exports.rawDefaultInvalidMobileNumber =
  exports.validatePassword =
  exports.validateUsername =
  exports.salted_hash =
    void 0;
const bcryptjs_1 = require("bcryptjs");
const configs_1 = require("configs");
const helpers_1 = require("routers/utils/helpers");
const salted_hash = (password) =>
  (0, bcryptjs_1.hash)(password, configs_1.bcrypt_config.salt);
exports.salted_hash = salted_hash;
// ---------------------------- //
// * validate Implementations * //
// ---------------------------- //
const validateUsername = (body) =>
  (0, helpers_1.validate)(body, "username", (v) => {
    if (typeof v !== "string" || v.match(/\W/)) return;
    if (v.length < 20) return v;
  });
exports.validateUsername = validateUsername;
const validatePassword = (body, alias = "password") =>
  (0, helpers_1.validate)(body, alias, (v) => {
    if (typeof v !== "string" || v.match(/\s/)) return;
    const { length } = v;
    if (length > 8 && length < 50) return v;
  });
exports.validatePassword = validatePassword;
const rawDefaultInvalidMobileNumber = (body) =>
  (0, helpers_1.rawDefaultInvalid)(
    body,
    "mobile_number",
    (v) => (typeof v === "number" || typeof v === "string") && v.toString()
  );
exports.rawDefaultInvalidMobileNumber = rawDefaultInvalidMobileNumber;
const user_genders = ["F", "M", "O", "N"];
const rawDefaultInvalidGender = (body) =>
  (0, helpers_1.rawDefaultInvalid)(
    body,
    "gender",
    (v) => user_genders.includes(v) && v
  );
exports.rawDefaultInvalidGender = rawDefaultInvalidGender;
