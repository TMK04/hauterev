export type Unpartial<T> = {
  [K in keyof Required<T>]: T[K] extends Required<T>[K]
    ? T[K] | undefined
    : T[K] | null | undefined;
};

export type ColumnsTuple<T> = readonly (keyof T)[];

export type Result<T, C extends ColumnsTuple<T>> = Promise<
  {
    [K in C[number]]: T[K];
  }[]
>;
