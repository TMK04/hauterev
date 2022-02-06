import getEnvVar from "./getEnvVar";

const jwt_config = {
  access_token_secret: getEnvVar("JWT_ACCESS_TOKEN_SECRET"),
  refresh_token_secret: getEnvVar("JWT_REFRESH_TOKEN_SECRET")
};

export default jwt_config;
