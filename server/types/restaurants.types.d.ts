import type { SelectRestaurantsOptions } from "db/types";
import type { QueryRecord } from "utils/types";

export type GetRestaurantsQuery = {
  [K in keyof SelectRestaurantsOptions]-?: QueryRecord<K>[K];
};
