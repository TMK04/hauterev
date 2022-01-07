"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NextError extends Error {
    constructor(status_code, message) {
        super(message);
        this.status_code = status_code;
    }
}
exports.default = NextError;
