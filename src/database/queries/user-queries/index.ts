import type { User, UserUsername } from "../types";
import type { ColumnsTuple, Result } from "../utils/types";

import db from "database";

// ----------- //
// * Helpers * //
// ----------- //

const userTable = () => db<User>("user");

const user = (username: UserUsername) => userTable().where({ username });

// ----------- //
// * Queries * //
// ----------- //

// *--- Insert ---* //

export const insertUser = async (insert_user: User) => userTable().insert(insert_user);

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

export type UpdateUser = Partial<Omit<User, "created_timestamp">>;

export const updateUserByUsername = (username: UserUsername, update_user: UpdateUser) =>
  user(username).update(update_user);

// *--- Delete ---* //

export const deleteUserByUsername = (username: UserUsername) => user(username).del();
