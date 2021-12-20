import type { ReviewID } from "./Review";
import type { UserUsername } from "./UserCredentials";

export default interface HelpfulMark {
  username: UserUsername;
  review_id: ReviewID;
}
