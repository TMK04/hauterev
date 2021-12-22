<<<<<<< HEAD
import type { ID, Timestamp, UserUsername } from ".";
=======
import type { ID, Timestamp, UserUsername } from "./types";
>>>>>>> 3049c2f (feat(knex): add knex.js to build queries & make transactions)

import db from "database";

export interface Bookmark {
  username: UserUsername;
  restaurant_id: ID;
  timestamp: Timestamp;
}

const bookmarkSchema = () => db<Bookmark>("bookmark");

export default bookmarkSchema;
