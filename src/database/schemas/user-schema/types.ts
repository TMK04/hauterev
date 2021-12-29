import type { Name, RawDefault, Timestamp } from "../types";

/**
 * @type {VARCHAR(20)}
 */
export type UserUsername = string;

/**
 * Hashed password
 * @type {CHAR(60)}
 */
export type UserPasswordHash = string;

/**
 * @type {VARCHAR(15)}
 */
export type UserMobileNumber = string;

/**
 * @type {VARCHAR(100)}
 */
export type UserAddress = string;

/**
 * @type {VARCHAR(255)}
 */
export type UserEmail = string;

/**
 * @type {CHAR(1)}
 */
export type UserGender = "F" | "M" | "O" | "N";

export interface User {
  username: UserUsername;
  password_hash: UserPasswordHash;
  email: UserEmail;
  last_name: Name;
  first_name: Name | RawDefault;
  mobile_number: UserMobileNumber | RawDefault;
  address: UserAddress | RawDefault;
  gender: UserGender | RawDefault;
  created_timestamp: Timestamp;
}
