import type { RequestHandler } from "express";
import type { AuthenticatedLocals, PatchUserBody, PostUserBody, UsernameParams } from "types";

import { NotFoundError } from "Errors";
import { review_db, user_db } from "db";
import { catchNext } from "helpers";
import { validatePatchUserBody, validatePostUserBody } from "validation";

export const createUser: RequestHandler<any, any, PostUserBody> = ({ body }, res, next) =>
  catchNext(async () => {
    await user_db.insertUser(await validatePostUserBody(body));
    res.sendStatus(201);
  }, next);

export const retrieveUser: RequestHandler<UsernameParams, any, any, any, AuthenticatedLocals> = (
  { params },
  res,
  next
) =>
  catchNext(async () => {
    const { username } = params;
    const user = (
      await (res.locals.authenticated
        ? user_db.selectUserAsUser(username)
        : user_db.selectUserByUsername(username))
    )[0];
    if (!user) throw new NotFoundError("User", username);

    user.reviews = await review_db.selectReviewsByUsername(username);
    res.json(user);
  }, next);

export const updateUser: RequestHandler<UsernameParams, any, PatchUserBody> = (
  { body, params },
  res,
  next
) =>
  catchNext(async () => {
    await user_db.updateUserByUsername(params.username, await validatePatchUserBody(body));
    res.sendStatus(205);
  }, next);

export const deleteUser: RequestHandler<UsernameParams> = ({ params }, res, next) =>
  catchNext(async () => {
    await user_db.deleteUserByUsername(params.username);
    res.sendStatus(204);
  }, next);
