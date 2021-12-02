import type SQLCallback from "./SQLCallback";
import type { Query } from "mysql2";

import db from "connection";
import { select } from "helpers/sql-statements";

export default class RestaurantsDB {
  getAllRestaurants = (callback?: SQLCallback): Query => db.query(select("restaurant"), callback);
}
