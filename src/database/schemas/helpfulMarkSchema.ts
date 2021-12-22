<<<<<<< HEAD
import type { ID, UserUsername } from ".";
=======
import type { ID, UserUsername } from "./types";
>>>>>>> 3049c2f (feat(knex): add knex.js to build queries & make transactions)

import db from "database";

export interface HelpfulMark {
  username: UserUsername;
  review_id: ID;
}

const helpfulMarkSchema = () => db<HelpfulMark>("helpful_mark");

export default helpfulMarkSchema;
