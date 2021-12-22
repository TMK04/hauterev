import { Knex } from "knex";

import type { UserCredentials, UserInfo, UserUsername } from "database/schemas/types";

import db from "database";
import { userCredentialsSchema, userInfoSchema } from "database/schemas";

export type RegisterUser = UserCredentials & UserInfo;

export const registerUser = async ({
  username,
  password_hash,
  mobile_number,
  address,
  email,
  first_name,
  last_name,
  gender,
  created_timestamp
}: RegisterUser) => {
  const trx = await db.transaction();
  try {
    await userCredentialsSchema()
      .transacting(trx)
      .insert({ username, password_hash, mobile_number, address });
    await userInfoSchema()
      .transacting(trx)
      .insert({ username, email, first_name, last_name, gender, created_timestamp });
    await trx.commit();
  } catch (err) {
    await trx.rollback(err);
  }
};

const byUsername = (qb: Knex.QueryBuilder, username: UserUsername, alias = "username") =>
  qb.where(alias, username);

export const getPasswordHashByUsername = (username: UserUsername) =>
  byUsername(userCredentialsSchema().select("password_hash"), username);
