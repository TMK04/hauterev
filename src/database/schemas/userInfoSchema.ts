<<<<<<< HEAD
import type { Name, Timestamp, UserUsername } from ".";
=======
import type { Name, Timestamp, UserUsername } from "./types";
>>>>>>> 3049c2f (feat(knex): add knex.js to build queries & make transactions)

import db from "database";

/**
 * @type {VARCHAR(255)}
 */
export type UserEmail = string;
<<<<<<< HEAD

export const user_genders = <const>["F", "M", "O"];

/**
 * @type {CHAR(1)}
 */
export type UserGender = typeof user_genders[number];

export const userGender = (gender: string | undefined) =>
  user_genders.includes(<UserGender>gender) ? <UserGender>gender : "O";
=======
/**
 * @type {CHAR(1)}
 */
export type UserGender = "F" | "M" | "O";
>>>>>>> 3049c2f (feat(knex): add knex.js to build queries & make transactions)

export interface UserInfo {
  username: UserUsername;
  email: string;
  first_name?: Name;
  last_name: Name;
  gender: UserGender;
  created_timestamp: Timestamp;
}

const userInfoSchema = () => db<UserInfo>("user_info");

export default userInfoSchema;
