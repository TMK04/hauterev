import type { FieldPacket, OkPacket, QueryError, ResultSetHeader, RowDataPacket } from "mysql2";

type SQLCallback = <
  T extends RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader
>(
  err: QueryError | null,
  result: T,
  fields: FieldPacket[]
) => any;

export default SQLCallback;
