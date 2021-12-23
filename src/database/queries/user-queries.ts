import { Knex } from "knex";

import db from "database";
import {
  UserCredentials,
  UserInfo,
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
      await userCredentialsSchema()
        .transacting(trx)
        .update(filter(edit_user_credentials))
        .where({ username });

    if (notEmpty(edit_user_info))
      await userInfoSchema()
        .transacting(trx)
        .update(filter(edit_user_info))
        .where({ username: edit_user_credentials.username ?? username });
  });

export const deleteUser = (username: UserUsername) =>
  userCredentialsSchema().del().where({ username });
