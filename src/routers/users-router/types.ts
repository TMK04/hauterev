import type { UnknownRecord } from "routers/utils/types";

export type UsernameBody = UnknownRecord<"username">;

export type PasswordBody = UnknownRecord<"password">;

export type AuthenticateBody = UsernameBody & PasswordBody;

export type PostUserBody = AuthenticateBody &
  UnknownRecord<"email" | "last_name" | "first_name" | "mobile_number" | "address" | "gender">;
