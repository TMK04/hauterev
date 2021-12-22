import { compare } from "bcryptjs";
import { RequestHandler } from "express";

import type { PasswordBody } from "./types";
import type { UserUsername } from "database/schemas/types";

import { getPasswordHashByUsername } from "database/queries";
import { catchNext } from "routers/middleware-wrappers";

import users_router from "./router";

const user_path = "/:username";

interface UsernameParams {
  username: UserUsername;
}

interface AuthenticatedLocals {
  authenticated: boolean;
}

const authenticate: RequestHandler<UsernameParams> = async ({ body, params }, res, next) =>
  catchNext(async () => {
    const password_hash_result = await getPasswordHashByUsername(params.username);
    if (!password_hash_result.length) return res.status(404).send("User not found.");

    const password = (<PasswordBody>body).password ?? "";
    const password_hash = password_hash_result[0].password;
    (<AuthenticatedLocals>res.locals).authenticated = await compare(password, password_hash);
    next();
  }, next);

users_router.use(user_path, authenticate);
