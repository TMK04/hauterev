"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = exports.isDefined = exports.simpleNumberNullInvalid = exports.simpleNumberValidate = exports.simpleStringNullInvalid = exports.simpleStringRawDefaultInvalid = exports.simpleStringValidate = exports.nullInvalid = exports.rawDefaultInvalid = exports.defaultInvalid = exports.validate = exports.catchNext = void 0;
const raw_default_1 = __importDefault(require("database/raw-default"));
const Errors_1 = require("./Errors");
const catchNext = (fn, next) => fn().catch(next);
exports.catchNext = catchNext;
function validate(data, key, validateFn, default_invalid = false, default_value) {
    const value = validateFn(data[key]);
    if (value)
        return value;
    if (default_invalid)
        return default_value;
    throw new Errors_1.InvalidError(key.toString());
}
exports.validate = validate;
// *--- Extensions ---* //
const defaultInvalid = (data, key, validateFn, default_value) => validate(data, key, validateFn, true, default_value);
exports.defaultInvalid = defaultInvalid;
const rawDefaultInvalid = (body, key, validateFn) => (0, exports.defaultInvalid)(body, key, validateFn, raw_default_1.default);
exports.rawDefaultInvalid = rawDefaultInvalid;
const nullInvalid = (query, key, validateFn) => (0, exports.defaultInvalid)(query, key, validateFn, null);
exports.nullInvalid = nullInvalid;
// *--- validateFn's ---* //
const simpleStringValidateFn = (v) => typeof v === "string" && v;
const simpleNumberValidateFn = (v) => {
    if (typeof v === "string")
        v = +v;
    if (typeof v === "number" && isFinite(v))
        return v;
};
// *--- Implementations ---* //
const simpleStringValidate = (data, key) => validate(data, key, simpleStringValidateFn);
exports.simpleStringValidate = simpleStringValidate;
const simpleStringRawDefaultInvalid = (body, key) => (0, exports.rawDefaultInvalid)(body, key, simpleStringValidateFn);
exports.simpleStringRawDefaultInvalid = simpleStringRawDefaultInvalid;
const simpleStringNullInvalid = (query, key) => (0, exports.nullInvalid)(query, key, simpleStringValidateFn);
exports.simpleStringNullInvalid = simpleStringNullInvalid;
const simpleNumberValidate = (data, key) => validate(data, key, simpleNumberValidateFn);
exports.simpleNumberValidate = simpleNumberValidate;
const simpleNumberNullInvalid = (query, key) => (0, exports.nullInvalid)(query, key, simpleNumberValidateFn);
exports.simpleNumberNullInvalid = simpleNumberNullInvalid;
// ---------- //
// * Checks * //
// ---------- //
const isDefined = (value) => typeof value !== "undefined";
exports.isDefined = isDefined;
const isEmpty = (data) => {
    for (const key in data) {
        if (data[key])
            return false;
    }
    return true;
};
exports.isEmpty = isEmpty;
