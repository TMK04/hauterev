import { Knex } from "knex";

import db from "database";
import {
  UserCredentials,
  UserInfo,
  UserPasswordHash,
  UserUsername,
  userCredentialsSchema,
  userInfoSchema
} from "database/schemas";

export type RegisterUser = UserCredentials & UserInfo;

export const registerUser = async ({
  username,
  password_hash,
  mobile_number,
  address,
  email,
  first_name,
  last_name,
  gender,
  created_timestamp
}: RegisterUser) =>
  db.transaction(async (trx) => {
    await userCredentialsSchema()
      .transacting(trx)
      .insert({ username, password_hash, mobile_number, address });

    return userInfoSchema()
      .transacting(trx)
      .insert({ username, email, first_name, last_name, gender, created_timestamp });
  });

const byUsername = (qb: Knex.QueryBuilder, username: UserUsername, alias = "username") =>
  qb.where(alias, username);

type PasswordHashResult = [{ password_hash: UserPasswordHash }];

export const getPasswordHashByUsername = (username: UserUsername): Promise<PasswordHashResult> =>
  byUsername(userCredentialsSchema().select("password_hash"), username);

const selectUserInfo = () => userInfoSchema().select();

export const getUserProfileByUsername = (username: UserUsername) =>
  byUsername(selectUserInfo(), username);

export const getUserProfileAsUser = (username: UserUsername) =>
  byUsername(
    userCredentialsSchema()
      .select(
        "user_credentials.username",
        "user_credentials.mobile_number",
        "user_credentials.address",
        "user_info.*"
      )
      .join(selectUserInfo().as("user_info"), "user_credentials.username", "user_info.username"),
    username,
    "user_credentials.username"
  );
