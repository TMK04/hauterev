export type ColumnsTuple<T> = readonly (keyof T)[];

export type Result<T, C extends ColumnsTuple<T>> = Promise<
  {
    [K in C[number]]: T[K];
  }[]
>;

export type Search<T> = T | null | undefined;
