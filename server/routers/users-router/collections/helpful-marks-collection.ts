import type { UsernameParams } from "../types";
import type { ReviewIDBody } from "./types";

import users_router from "../router";
import { deleteHelpfulMark, insertHelpfulMark } from "database/queries";
import { UnauthorizedError } from "routers/utils/Errors";
import { catchNext, simpleNumberValidate } from "routers/utils/helpers";

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
