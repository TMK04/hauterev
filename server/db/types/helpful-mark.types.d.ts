import type { ID, UserUsername } from "./common.types";

export interface HelpfulMark {
  username: UserUsername;
  review_id: ID;
}

export interface SelectHelpfulCount {
  helpful_count: number;
}
