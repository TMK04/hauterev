export type Key = string | number | symbol;

export type Optional<T> = {
  [K in keyof T]?: T[K];
};

export type RKRecord<KA extends readonly string[], T = string> = Record<KA[number], T>;
