import type { Unpartial } from "./types";

import db from "database";
import {
  UserCredentials,
  UserInfo,
  UserUsername,
  userCredentialsSchema,
  userInfoSchema
} from "database/schemas";

import { filter, notEmpty } from "./helpers";

export type InsertUser = Unpartial<UserCredentials & UserInfo>;

export const insertUser = async ({
  username,
  password_hash,
  mobile_number,
  address,
  email,
  first_name,
  last_name,
  gender,
  created_timestamp
}: InsertUser) =>
  db.transaction(async (trx) => {
    await userCredentialsSchema()
      .transacting(trx)
      .insert(filter({ username, password_hash, mobile_number, address }));

    return userInfoSchema()
      .transacting(trx)
      .insert(filter({ username, email, first_name, last_name, gender, created_timestamp }));
  });

export const selectPasswordHashByUsername = (
  username: UserUsername
): Promise<Pick<UserCredentials, "password_hash">[]> =>
  userCredentialsSchema().select("password_hash").where({ username });

export const selectUserProfileByUsername = (username: UserUsername): Promise<UserInfo[]> =>
  userInfoSchema().select().where({ username });

export const selectUserProfileAsUser = (
  username: UserUsername
): Promise<(Pick<UserCredentials, "mobile_number" | "address"> & UserInfo)[]> =>
  userCredentialsSchema()
    .select(
      "user_credentials.username",
      "user_credentials.mobile_number",
      "user_credentials.address",
      "user_info.*"
    )
    .join(
      userInfoSchema().select().where({ username }).as("user_info"),
      "user_credentials.username",
      "user_info.username"
    )
    .where({
      "user_credentials.username": username
    });

type UpdateUserCredentials = Unpartial<UserCredentials>;
type UpdateUserInfo = Unpartial<Omit<UserInfo, "username" | "created_timestamp">>;

export const updateUserProfileAsUser = (
  username: UserUsername,
  update_user_credentials: UpdateUserCredentials,
  update_user_info: UpdateUserInfo
) =>
  db.transaction(async (trx) => {
    if (notEmpty(update_user_credentials))
      await userCredentialsSchema()
        .transacting(trx)
        .update(filter(update_user_credentials))
        .where({ username });

    if (notEmpty(update_user_info))
      await userInfoSchema()
        .transacting(trx)
        .update(filter(update_user_info))
        .where({ username: update_user_credentials.username ?? username });
  });

export const deleteUser = (username: UserUsername) =>
  userCredentialsSchema().del().where({ username });
