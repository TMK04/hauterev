import type { ParamRecord } from "routers/utils/types";

export type UsernameParams = ParamRecord<"username">;

export type AuthenticatedLocals = Partial<Record<"authenticated", boolean>>;
