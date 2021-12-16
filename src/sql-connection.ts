import { createConnection } from "mysql2";

import { mysql_config } from "configs";

const db = createConnection(mysql_config);
db.connect((err) => {
  if (err) throw err;
});

export default db;
