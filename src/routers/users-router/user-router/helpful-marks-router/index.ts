import type { UsernameParams } from "../types";
import type { UnknownRecord } from "routers/utils/types";

import { deleteHelpfulMark, insertHelpfulMark } from "database/schemas";
import { UnauthorizedError } from "routers/utils/Errors";
import { catchNext, mergeRouter, simpleNumberValidate } from "routers/utils/helpers";

const helpful_marks_router = mergeRouter();

// *--- Types ---* //

type ReviewIDBody = UnknownRecord<"review_id">;

// ----- //
// * / * //
// ----- //

// *--- POST ---* //

helpful_marks_router.post<UsernameParams, any, ReviewIDBody>("/", ({ body, params }, res, next) =>
  catchNext(async () => {
    const review_id = simpleNumberValidate(body, "review_id");
    await insertHelpfulMark({ review_id, username: params.username }).catch(() => {
      throw new UnauthorizedError("Review already marked as helpful");
    });
    res.sendStatus(201);
  }, next)
);

// *--- DELETE ---* //

helpful_marks_router.delete<UsernameParams, any, ReviewIDBody>("/", ({ body, params }, res, next) =>
  catchNext(async () => {
    const review_id = simpleNumberValidate(body, "review_id");
    await deleteHelpfulMark({ review_id, username: params.username });
    res.sendStatus(204);
  }, next)
);

export default helpful_marks_router;
