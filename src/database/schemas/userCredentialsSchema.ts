import db from "database";

/**
 * @type {VARCHAR(20)}
 */
export type UserUsername = string;
/**
<<<<<<< HEAD
<<<<<<< HEAD
 * Hashed password
=======
>>>>>>> 3049c2f (feat(knex): add knex.js to build queries & make transactions)
=======
 * Hashed password
>>>>>>> af16d42 (feat(users-router): add user-queries & users-router)
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

export interface UserCredentials {
  username: UserUsername;
  password_hash: UserPasswordHash;
  mobile_number?: UserMobileNumber;
  address?: UserAddress;
}

const userCredentialsSchema = () => db<UserCredentials>("user_credentials");

export default userCredentialsSchema;
