export type ColumnsTuple<T> = readonly (keyof T)[];

export type Search<T> = T | null | undefined;
