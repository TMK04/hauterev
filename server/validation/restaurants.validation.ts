import type { SelectRestaurantsOptions } from "db/types";
import type { GetRestaurantsQuery } from "types";

import {
  nullInvalidOpeningHours,
  nullInvalidRegion,
  numberNullInvalid,
  stringNullInvalid
} from "./helpers/validates";

export const castGetRestaurantsQuery = (query: GetRestaurantsQuery): SelectRestaurantsOptions => ({
  search: stringNullInvalid(query, "search"),
  opening_hours: nullInvalidOpeningHours(query),
  rating: numberNullInvalid(query, "rating"),
  region: nullInvalidRegion(query)
});
