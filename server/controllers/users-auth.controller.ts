import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import type { CookieOptions, RequestHandler } from "express";

import { NotFoundError, UnauthenticatedError } from "Errors";
import { jwt_config } from "configs";
import { user_db } from "db";
import { catchNext } from "helpers";
import { AuthenticateBody } from "types";
import { validateAuthenticateBody } from "validation";

export const login: RequestHandler<any, any, AuthenticateBody> = ({ body }, res, next) =>
  catchNext(async () => {
    const { username, password } = validateAuthenticateBody(body);

    const user_password_hash = (await user_db.selectPasswordHashByUsername(username))[0];
    if (!user_password_hash) throw new NotFoundError("User", username);

    if (!(await compare(password, user_password_hash.password_hash)))
      throw new UnauthenticatedError();

    const access_token = sign({ username }, jwt_config.access_token_secret, { expiresIn: "7d" });
    const options: CookieOptions = { expires: new Date(Date.now() + 604800000) };
    res
      .cookie("username", username, options)
      .cookie("access_token", access_token, options)
      .sendStatus(200);
  }, next);
