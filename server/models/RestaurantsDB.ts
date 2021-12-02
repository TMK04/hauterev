import type SQLCallback from "./SQLCallback";
import type { Query } from "mysql2";

import { select } from "helpers/sql-statements";
import db from "sql-connection";

export default class RestaurantsDB {
  getAllRestaurants = (callback?: SQLCallback): Query => db.query(select("restaurant"), callback);
}
