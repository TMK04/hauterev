import type { SelectRestaurantsOptions } from "db/types";
import type { GetRestaurantsQuery } from "types";

import { stringNullInvalid } from "./helpers/validates";

export const castGetRestaurantsQuery = (query: GetRestaurantsQuery): SelectRestaurantsOptions => ({
  search: stringNullInvalid(query, "search")
});
