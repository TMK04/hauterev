"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcrypt_config = exports.mysql_config = exports.express_config = void 0;
const getEnvVar = (var_key) => process.env[var_key];
exports.express_config = {
    port: +getEnvVar("PORT"),
    hostname: getEnvVar("HOSTNAME")
};
exports.mysql_config = {
    host: getEnvVar("SQL_HOST"),
    port: +getEnvVar("SQL_PORT"),
    user: getEnvVar("SQL_USER"),
    password: getEnvVar("SQL_PASSWORD"),
    database: getEnvVar("SQL_DATABASE")
};
exports.bcrypt_config = {
    salt: +getEnvVar("BCRYPT_SALT")
};
