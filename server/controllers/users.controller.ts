import { compare } from "bcryptjs";

import type { RequestHandler } from "express";
import type {
  AuthenticateBody,
  AuthenticatedLocals,
  PatchUserBody,
  PostUserBody,
  UsernameParams
} from "types";

import { NotFoundError, UnauthenticatedError } from "Errors";
import { user_db } from "db";
import { catchNext } from "helpers";
import { validateAuthenticateBody, validatePatchUserBody, validatePostUserBody } from "validation";

export const createUser: RequestHandler<any, any, PostUserBody> = ({ body }, res, next) =>
  catchNext(async () => {
    await user_db.insertUser(await validatePostUserBody(body));
    res.sendStatus(201);
  }, next);

export const login: RequestHandler<any, any, AuthenticateBody> = ({ body }, res, next) =>
  catchNext(async () => {
    const { username, password } = validateAuthenticateBody(body);

    const password_hash_result = await user_db.selectPasswordHashByUsername(username);
    if (!password_hash_result[0]) throw new NotFoundError("User", username);

    const password_hash = password_hash_result[0].password_hash;
    if (await compare(password, password_hash)) return res.sendStatus(200);

    throw new UnauthenticatedError();
  }, next);

export const retrieveUser: RequestHandler<UsernameParams, any, any, any, AuthenticatedLocals> = (
  { params },
  res,
  next
) =>
  catchNext(async () => {
    const { username } = params;
    const user_profile_result = await (res.locals.authenticated
      ? user_db.selectUserAsUser(username)
      : user_db.selectUserByUsername(username));
    const user_profile = user_profile_result[0];
    if (!user_profile) throw new NotFoundError("User", username);
    res.json(user_profile);
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
