import type { ID, UserUsername } from ".";

import db from "database";

export interface HelpfulMark {
  username: UserUsername;
  review_id: ID;
}

const helpfulMarkSchema = () => db<HelpfulMark>("helpful_mark");

export default helpfulMarkSchema;
