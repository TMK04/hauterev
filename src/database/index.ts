import { knex } from "knex";

import { mysql_config } from "configs";

const db = knex({ client: "mysql2", connection: mysql_config });

export default db;
