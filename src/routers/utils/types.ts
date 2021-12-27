type Key = string | number | symbol;

export type NoFalsy<T> = Exclude<T, void | false>;

export type UnknownRecord<K extends Key> = Record<K, unknown>;
