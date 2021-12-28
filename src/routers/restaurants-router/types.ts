import type { SelectRestaurantsOptions } from "database/schemas/types";
import type { QueryRecord } from "routers/utils/types";

export type GetRestaurantsQuery = {
  [K in keyof SelectRestaurantsOptions]-?: QueryRecord<K>[K];
};
