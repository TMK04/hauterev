import type { UsernameParams } from ".";
import type { UnknownRecord } from "routers/types";

import users_router from "..";
import { deleteHelpfulMark, insertHelpfulMark } from "database/queries";
import { UnauthorizedError } from "routers/Errors";
import { catchNext, simpleNumberValidate } from "routers/helpers";

// --------- //
// * Types * //
// --------- //

export type ReviewIDBody = UnknownRecord<"review_id">;

// ---------------------------------- //
// * /users/:username/helpful-marks * //
// ---------------------------------- //

// *--- POST ---* //

users_router.post<UsernameParams, any, ReviewIDBody>(
  "/:username/helpful-marks",
  ({ body, params }, res, next) =>
    catchNext(async () => {
      const review_id = simpleNumberValidate(body, "review_id");
      await insertHelpfulMark({ review_id, username: params.username }).catch(() => {
        throw new UnauthorizedError("Review already marked as helpful");
      });
      res.sendStatus(201);
    }, next)
);

// *--- DELETE ---* //

users_router.delete<UsernameParams, any, ReviewIDBody>(
  "/:username/helpful-marks",
  ({ body, params }, res, next) =>
    catchNext(async () => {
      const review_id = simpleNumberValidate(body, "review_id");
      await deleteHelpfulMark({ review_id, username: params.username });
      res.sendStatus(204);
    }, next)
);
