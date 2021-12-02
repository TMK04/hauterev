import type { Key } from "types";

export const joinComma = (arr: string[]): string => arr.join(",");

export const where = (statement: string, clause: string): string => `${statement} WHERE ${clause}`;

export const select = (schema: string, fields: Key[] = ["*"]): string =>
  `SELECT ${fields?.join(",")} FROM ${schema}`;

export const insertInto = (schema: string, fields: Key[]): string =>
  `INSERT INTO ${schema} (${fields.join(",")}) VALUES (${joinComma(fields.map(() => "?"))})`;

export const update = (schema: string, fields: Key[], where_clause: string): string =>
  where(
    `UPDATE ${schema} SET ${joinComma(fields.map((field) => `${String(field)}=?`))}`,
    where_clause
  );

export const deleteFrom = (schema: string, where_clause: string): string =>
  where(`DELETE FROM ${schema}`, where_clause);
