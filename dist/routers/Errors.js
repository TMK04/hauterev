"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.UnauthenticatedError = exports.InvalidError = exports.NotFoundError = void 0;
const NextError_1 = __importDefault(require("NextError"));
class NotFoundError extends NextError_1.default {
    constructor(type, identifier) {
        super(404, `${type} ${identifier} not found`);
    }
}
exports.NotFoundError = NotFoundError;
class InvalidError extends NextError_1.default {
    constructor(param) {
        super(400, `Invalid ${param}`);
    }
}
exports.InvalidError = InvalidError;
class UnauthenticatedError extends NextError_1.default {
    constructor() {
        super(401, "Incorrect username or password");
    }
}
exports.UnauthenticatedError = UnauthenticatedError;
class UnauthorizedError extends NextError_1.default {
    constructor(message) {
        super(403, message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
