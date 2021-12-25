export type RKRecord<KT extends readonly string[]> = Record<KT[number], string>;

export type RKMappedRecord<T, KT extends readonly (keyof T)[]> = {
  [K in KT[number]]: T[K];
};
