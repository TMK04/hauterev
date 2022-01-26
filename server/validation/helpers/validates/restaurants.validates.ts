import type { RestaurantRegion, SelectRestaurantsOptions } from "db/types";
import type { QueryRecord } from "helpers/types";

import { nullInvalid } from "./wrappers.validates";

const restaurant_regions: readonly RestaurantRegion[] = [
  "North",
  "South",
  "East",
  "West",
  "Central"
];

export const nullInvalidRegion = <T extends QueryRecord<"region">>(
  query: T
): SelectRestaurantsOptions["region"] =>
  nullInvalid(query, "region", (v: any) => restaurant_regions.includes(v) && <RestaurantRegion>v);

export const nullInvalidOpeningHours = <T extends QueryRecord<"opening_hours">>(
  query: T
): SelectRestaurantsOptions["opening_hours"] =>
  nullInvalid(query, "opening_hours", (v: any) => {
    if (!v) return;
    v = parseInt(v, 2);
    if (isFinite(v)) return v;
  });
