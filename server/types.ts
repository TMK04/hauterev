export type Key = string | number | symbol;

export type Optional<T> = {
  [K in keyof T]?: T[K];
};
