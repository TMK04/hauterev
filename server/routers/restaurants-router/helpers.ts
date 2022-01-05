import type { QueryRecord } from "routers/utils/types";

import { RestaurantRegion } from "database/queries/types";
import { nullInvalid } from "routers/utils/helpers";

// --------------------- //
// * validate variants * //
// --------------------- //

const restaurant_regions: readonly RestaurantRegion[] = [
  "North",
  "South",
  "East",
  "West",
  "Central"
];

export const nullInvalidRegion = <T extends QueryRecord<"region">>(query: T) =>
  nullInvalid(query, "region", (v: any) => restaurant_regions.includes(v) && <RestaurantRegion>v);

export const nullInvalidOpeningHours = <T extends QueryRecord<"opening_hours">>(query: T) =>
  nullInvalid(query, "opening_hours", (v: any) => {
    if (!v) return;
    v = parseInt(v, 2);
    if (isFinite(v)) return v;
  });
