import type { UserUsername } from "database/schemas/types";

export interface UsernameParams {
  username: UserUsername;
}

export interface AuthenticatedLocals {
  authenticated?: boolean;
}
