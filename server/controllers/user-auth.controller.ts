import type { RequestHandler } from "express";

import { catchNext } from "helpers";

export const logout: RequestHandler = (_, res, next) =>
  catchNext(
    async () => res.clearCookie("access_token").clearCookie("username").sendStatus(200),
    next
  );
