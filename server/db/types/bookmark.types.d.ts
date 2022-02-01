import type { ID, Timestamp, UserUsername } from "./common.types";

export interface Bookmark {
  username: UserUsername;
  restaurant_id: ID;
  timestamp: Timestamp;
}

export type SelectBookmarks = Bookmark[];
