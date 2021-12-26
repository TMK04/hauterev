import type { User, UserUsername } from "../types";
import type { ColumnsTuple, Result, Unpartial } from "../utils/types";

import { filter, notEmpty } from "../utils/helpers";
import db from "database";

// ----------- //
// * Helpers * //
// ----------- //

const userSchema = () => db<User>("user");

const user = (username: UserUsername) => userSchema().where({ username });

// ----------- //
// * Queries * //
// ----------- //

// *--- Insert ---* //

export const insertUser = async (insert_user: Unpartial<User>) =>
  userSchema().insert(filter(insert_user));

// *--- Select ---* //

export const selectPasswordHashByUsername = (
  username: UserUsername
): Promise<Pick<User, "password_hash">[]> => user(username).select("password_hash");

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

export const selectUserAsUser = (username: UserUsername): Result<User, typeof user_columns_au> =>
  user(username).select(...user_columns_au);

// *--- Update ---* //

export const updateUserProfileAsUser = (
  username: UserUsername,
  update_user: Unpartial<Omit<User, "created_timestamp">>
) => (notEmpty(update_user) ? user(username).update(filter(update_user)) : Promise.reject());

// *--- Delete ---* //

export const deleteUser = (username: UserUsername) => user(username).del();
