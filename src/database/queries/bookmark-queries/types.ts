import type { ID, Timestamp, UserUsername } from "../types";

export interface Bookmark {
  username: UserUsername;
  restaurant_id: ID;
  timestamp: Timestamp;
}
