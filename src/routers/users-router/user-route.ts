import { compare } from "bcryptjs";
import { RequestHandler } from "express";

import type { PasswordBody } from "./types";
import type { UserUsername } from "database/schemas/types";
import type { Optional } from "types";

import {
  getPasswordHashByUsername,
  getUserProfileAsUser,
  getUserProfileByUsername
} from "database/queries";
import { catchNext } from "routers/middleware-wrappers";

import users_router from "./router";

const user_path = "/:username";

interface UsernameParams {
  username: UserUsername;
}

interface AuthenticatedLocals {
  authenticated?: boolean;
}

/**
 * Check if provided password matches user password,
 * or end the request if no such user exists
 *
 * @param {PasswordBody} req.body
 * @param res - locals stores authenticated boolean; send ends the request
 * @param next
 */
const authenticate: RequestHandler<UsernameParams> = ({ body, params }, res, next) =>
  catchNext(async () => {
    const password = (<Optional<PasswordBody>>body).password;
    if (!password) return next();

    const password_hash_result = await getPasswordHashByUsername(params.username);
    if (!password_hash_result.length) return res.status(404).send("User not found.");

    const password_hash = password_hash_result[0].password_hash;
    (<AuthenticatedLocals>res.locals).authenticated = await compare(password, password_hash);
    next();
  }, next);

users_router.use(user_path, authenticate);

const user_route = users_router.route(user_path);

user_route.get(({ params }, res, next) =>
  catchNext(async () => {
    const { username } = params;
    const user_profile_result = await ((<AuthenticatedLocals>res.locals).authenticated
      ? getUserProfileAsUser(username)
      : getUserProfileByUsername(username));
    const user_profile = user_profile_result[0];
    res.json(user_profile);
  }, next)
);
