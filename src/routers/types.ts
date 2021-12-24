import type { ID } from "database/schemas";

export type RKRecord<KA extends readonly string[], T = string> = Record<KA[number], T>;

export interface IDParams {
  id: ID;
}
