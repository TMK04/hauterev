import type { ID, Timestamp, UserUsername } from ".";

export interface Bookmark {
  username: UserUsername;
  restaurant_id: ID;
  timestamp: Timestamp;
}
