import type { PostUserBody } from "../types";
import type { ParamsRecord, UnknownRecord } from "routers/utils/types";

export type UsernameParams = ParamsRecord<"username">;

export type AuthenticatedLocals = Partial<Record<"authenticated", boolean>>;

export type PatchUserBody = Omit<PostUserBody, "password" | "created_timestamp"> &
  UnknownRecord<"new_password">;
