import type { UpdateUser, User } from "db/types";
import type { AuthenticateBody, PasswordBody, PatchUserBody, PostUserBody } from "types";

import { InvalidError } from "Errors";
import { saltedHash } from "utils";

import { isDefined, isEmpty } from "./helpers/checks";
import {
  rawDefaultInvalidGender,
  stringRawDefaultInvalid,
  stringValidate,
  validatePassword,
  validateUsername
} from "./helpers/validates";

export const validatePasswordBody = (body: Partial<PasswordBody>) => ({
  password: stringValidate(body, "password")
});

export const validateAuthenticateBody = (body: AuthenticateBody) => ({
  ...validatePasswordBody(body),
  username: stringValidate(body, "username")
});

export const validatePostUserBody = async (body: PostUserBody): Promise<User> => ({
  email: stringValidate(body, "email"),
  last_name: stringValidate(body, "last_name"),
  password_hash: await saltedHash(validatePassword(body)),
  username: validateUsername(body),
  address: stringRawDefaultInvalid(body, "address"),
  first_name: stringRawDefaultInvalid(body, "first_name"),
  gender: rawDefaultInvalidGender(body),
  mobile_number: stringRawDefaultInvalid(body, "mobile_number"),
  created_timestamp: new Date()
});

export const validatePatchUserBody = async (body: PatchUserBody): Promise<UpdateUser> => {
  const { username, new_password, email, last_name, first_name, mobile_number, address, gender } =
    body;

  const update_user: UpdateUser = {};
  if (isDefined(username)) update_user.username = validateUsername(body);
  if (isDefined(new_password))
    update_user.password_hash = await saltedHash(validatePassword(body, "new_password"));
  if (isDefined(email)) update_user.email = stringValidate(body, "email");
  if (isDefined(last_name)) update_user.last_name = stringValidate(body, "last_name");
  if (isDefined(first_name)) update_user.first_name = stringRawDefaultInvalid(body, "first_name");
  if (isDefined(mobile_number))
    update_user.mobile_number = stringRawDefaultInvalid(body, "mobile_number");
  if (isDefined(address)) update_user.address = stringRawDefaultInvalid(body, "address");
  if (isDefined(gender)) update_user.gender = rawDefaultInvalidGender(body);

  if (isEmpty(update_user)) throw new InvalidError("body");

  return update_user;
};
