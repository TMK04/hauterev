import type { ID, Timestamp, UserUsername } from ".";

import db from "database";

export interface Bookmark {
  username: UserUsername;
  restaurant_id: ID;
  timestamp: Timestamp;
}

const bookmarkSchema = () => db<Bookmark>("bookmark");

export default bookmarkSchema;
