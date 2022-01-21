import { knex } from "knex";

import { db_config } from "configs";

const db = knex({ client: "mysql2", connection: db_config });

export default db;
