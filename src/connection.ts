import mysql from "mysql2";

import mysql_config from "../mysql-config.json";

const connection = mysql.createConnection(mysql_config);

connection.connect((err) => {
  if (err) throw err;
});

export default connection;
