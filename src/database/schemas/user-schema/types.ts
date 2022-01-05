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
export type UserMobileNumber = RawDefault | string;

/**
 * @type {VARCHAR(100)}
 */
export type UserAddress = RawDefault | string;

/**
 * @type {VARCHAR(255)}
 */
export type UserEmail = string;

export type FirstName = RawDefault | Name;

/**
 * @type {CHAR(1)}
 */
export type UserGender = RawDefault | "F" | "M" | "O" | "N";

export interface User {
  username: UserUsername;
  password_hash: UserPasswordHash;
  mobile_number: UserMobileNumber;
  address: UserAddress;
  email: UserEmail;
  first_name: FirstName;
  last_name: Name;
  gender: UserGender;
  created_timestamp: Timestamp;
}
