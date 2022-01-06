import { Router } from "express";

import type { IDParams } from "routers/types";

import { selectReviewByID } from "database/queries";
import { NotFoundError } from "routers/Errors";
import { catchNext } from "routers/helpers";

const review_router = Router({ mergeParams: true });

// *--- GET ---* //

review_router.get<IDParams>("/", ({ params }, res, next) =>
  catchNext(async () => {
    const { id } = params;
    const review_result = await selectReviewByID(+id);
    const review = review_result[0];
    if (!review) throw new NotFoundError("Review", id);
    res.json(review);
  }, next)
);

export default review_router;
