import { selectRestaurantByID } from "database/queries";
import { NotFoundError } from "routers/utils/Errors";
import { catchNext } from "routers/utils/helpers";

import restaurants_router from "./router";

// -------------------- //
// * /restaurants/:id * //
// -------------------- //

// *--- GET ---* //

restaurants_router.get(`/:id`, ({ params }, res, next) =>
  catchNext(async () => {
    const { id } = params;
    const restaurant_result = await selectRestaurantByID(+id);
    if (!restaurant_result[0]) throw new NotFoundError("Restaurant", id);
    res.json(restaurant_result[0]);
  }, next)
);
