import { ParamsRecord, UnknownRecord } from "utils/types";

export type UsernameBody = UnknownRecord<"username">;

export type PasswordBody = UnknownRecord<"password">;

export type AuthenticateBody = UsernameBody & PasswordBody;

export type PostUserBody = AuthenticateBody &
  UnknownRecord<"email" | "last_name" | "first_name" | "mobile_number" | "address" | "gender">;

export type UsernameParams = ParamsRecord<"username">;

export type AuthenticatedLocals = Partial<Record<"authenticated", boolean>>;

export type PatchUserBody = Omit<PostUserBody, "password" | "created_timestamp"> &
  UnknownRecord<"new_password">;
