import type { BcryptConfig } from "./types";

import getEnvVar from "./getEnvVar";

const bcrypt_config: BcryptConfig = {
  salt: +getEnvVar("BCRYPT_SALT")
};

export default bcrypt_config;
