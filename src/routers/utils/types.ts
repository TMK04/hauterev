import type { ID } from "database/schemas";

export type RKRecord<KT extends readonly string[]> = Record<KT[number], string>;

export type RKMappedRecord<T, KT extends readonly (keyof T)[]> = {
  [K in KT[number]]: T[K];
};

export interface IDParams {
  id: ID;
}
