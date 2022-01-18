export type ColumnsTuple<T> = readonly (keyof T)[];

export type Result<T, C extends ColumnsTuple<T>> = Promise<
  {
    [K in C[number]]: T[K];
  }[]
>;
