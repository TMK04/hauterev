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

type Data = { [key: string]: unknown };

type Filtered<T> = {
  [K in keyof T]: Knex.Raw<Exclude<T[K], null | undefined>>;
};

const filter = <T extends Data>(data: T): Filtered<T> => {
  const filtered = <Filtered<T>>data;
  for (const key in filtered) {
    if (data[key] === undefined) delete filtered[key];
    if (data[key] === null) filtered[key] = db.raw("DEFAULT");
  }
  return filtered;
};

type Deoptionalized<T> = {
  [K in keyof Required<T>]: T[K] extends Required<T>[K]
    ? T[K] | undefined
    : T[K] | null | undefined;
};

export type InsertUser = Deoptionalized<UserCredentials & UserInfo>;

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

const byUsername = (qb: Knex.QueryBuilder, username: UserUsername, alias = "username") =>
  qb.where(alias, username);

export const selectPasswordHashByUsername = (
  username: UserUsername
): Promise<[{ password_hash: UserPasswordHash }]> =>
  byUsername(userCredentialsSchema().select("password_hash"), username);

const selectUserInfo = () => userInfoSchema().select();

export const selectUserProfileByUsername = (username: UserUsername): Promise<[UserInfo]> =>
  byUsername(selectUserInfo(), username);

export const selectUserProfileAsUser = (
  username: UserUsername
): Promise<[Pick<UserCredentials, "mobile_number" | "address"> & UserInfo]> =>
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

type UpdateUserCredentials = Deoptionalized<UserCredentials>;
type UpdateUserInfo = Deoptionalized<Omit<UserInfo, "username" | "created_timestamp">>;

const notEmpty = (data: Data) => {
  for (const key in data) {
    if (data[key] !== undefined) return true;
  }
  return false;
};

export const updateUserProfileAsUser = (
  username: UserUsername,
  edit_user_credentials: UpdateUserCredentials,
  edit_user_info: UpdateUserInfo
) =>
  db.transaction(async (trx) => {
    if (notEmpty(edit_user_credentials))
      await byUsername(
        userCredentialsSchema().transacting(trx).update(filter(edit_user_credentials)),
        username
      );

    if (notEmpty(edit_user_info))
      await byUsername(
        userInfoSchema().transacting(trx).update(filter(edit_user_info)),
        edit_user_credentials.username ?? username
      );
  });

export const deleteUser = (username: UserUsername) =>
  byUsername(userCredentialsSchema().del(), username);
