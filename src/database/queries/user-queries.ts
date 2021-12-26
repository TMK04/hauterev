import type { Unpartial } from "./types";

import { UserUsername, userSchema, User } from "database/schemas";

import { filter, notEmpty } from "./helpers";

export const insertUser = async (insert_user: Unpartial<User>) =>
  userSchema().insert(filter(insert_user));

const user = (username: UserUsername) => userSchema().where({ username });

export const selectPasswordHashByUsername = (
  username: UserUsername
): Promise<Pick<User, "password_hash">[]> => user(username).select("password_hash");

type ColumnsTuple<T> = readonly (keyof T)[];
type Result<T, C extends ColumnsTuple<T>> = Promise<
  {
    [K in C[number]]: T[K];
  }[]
>;

const user_columns_bu: ColumnsTuple<User> = <const>[
  "email",
  "first_name",
  "last_name",
  "gender",
  "created_timestamp"
];

export const selectUserByUsername = (
  username: UserUsername
): Result<User, typeof user_columns_bu> => user(username).select(...user_columns_bu);

const user_columns_au: ColumnsTuple<User> = <const>["mobile_number", "address", ...user_columns_bu];

export const selectUserProfileAsUser = (
  username: UserUsername
): Result<User, typeof user_columns_au> => user(username).select(...user_columns_au);

type UpdateUser = Unpartial<Omit<User, "created_timestamp">>;

export const updateUserProfileAsUser = (username: UserUsername, update_user: UpdateUser) =>
  notEmpty(update_user) ? user(username).update(filter(update_user)) : Promise.reject();

export const deleteUser = (username: UserUsername) => user(username).del();
