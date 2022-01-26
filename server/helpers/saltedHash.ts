import { hash } from "bcryptjs";

import { bcrypt_config } from "configs";

const saltedHash = (password: string) => hash(password, bcrypt_config.salt);

export default saltedHash;
