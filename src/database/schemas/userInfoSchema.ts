import type { Name, Timestamp, UserUsername } from ".";

import db from "database";

/**
 * @type {VARCHAR(255)}
 */
export type UserEmail = string;

export const user_genders = <const>["F", "M", "O"];

/**
 * @type {CHAR(1)}
 */
export type UserGender = typeof user_genders[number];

export const userGender = (gender: string | undefined) =>
  user_genders.includes(<UserGender>gender) ? <UserGender>gender : "O";

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
