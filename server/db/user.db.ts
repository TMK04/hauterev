import type { SelectUser, UpdateUser, User, UserUsername } from "./types";

import { db } from "connections";

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

const user_columns_bu = <const>["email", "first_name", "last_name", "gender", "created_timestamp"];

export const selectUserByUsername = (
  username: UserUsername
): Promise<SelectUser<typeof user_columns_bu>> => user(username).select(...user_columns_bu);

const user_columns_au = <const>["mobile_number", "address", ...user_columns_bu];

export const selectUserAsUser = (
  username: UserUsername
): Promise<SelectUser<typeof user_columns_au>> => user(username).select(...user_columns_au);

// *--- Update ---* //

export const updateUserByUsername = (username: UserUsername, update_user: UpdateUser) =>
  user(username).update(update_user);

// *--- Delete ---* //

export const deleteUserByUsername = (username: UserUsername) => user(username).del();
