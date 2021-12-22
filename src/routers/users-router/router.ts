import { hash } from "bcryptjs";
import { Router } from "express";

import type { PasswordBody } from "./types";
import type {
  Name,
  UserAddress,
  UserEmail,
  UserGender,
  UserMobileNumber,
  UserUsername
} from "database/schemas/types";

import { bcrypt_config } from "configs";
import { registerUser } from "database/queries";
import { catchNext } from "routers/middleware-wrappers";

const users_router = Router();

interface LoginBody extends PasswordBody {
  username: UserUsername;
}

export interface PostUserBody extends LoginBody {
  mobile_number?: UserMobileNumber;
  address?: UserAddress;
  email: UserEmail;
  first_name?: Name;
  last_name: Name;
  gender: UserGender;
}

users_router.post("/", ({ body }, res, next) =>
  catchNext(async () => {
    const { username, password, mobile_number, address, email, first_name, last_name, gender } = <
      PostUserBody
    >body;
    const password_hash = await hash(password, bcrypt_config.salt_rounds);

    try {
      await registerUser({
        username,
        password_hash,
        mobile_number,
        address,
        email,
        first_name,
        last_name,
        gender,
        created_timestamp: new Date()
      });
    } catch (_) {
      return res.status(403).send("Forbidden: Username taken.");
    }

    res.sendStatus(201);
  }, next)
);

export default users_router;
