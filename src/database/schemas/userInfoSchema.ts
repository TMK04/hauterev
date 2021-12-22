import type { Name, Timestamp, UserUsername } from "./types";

import db from "database";

/**
 * @type {VARCHAR(255)}
 */
export type UserEmail = string;
/**
 * @type {CHAR(1)}
 */
export type UserGender = "F" | "M" | "O";

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
