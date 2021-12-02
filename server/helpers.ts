import { hash } from "bcryptjs";

import { bcrypt_config } from "configs";

export const salted_hash = (password: string) => hash(password, bcrypt_config.salt);
