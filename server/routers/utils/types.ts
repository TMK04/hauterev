type Key = string | number | symbol;

export type NoFalsy<T> = Exclude<T, void | false>;

/**
 * Usually describes an incoming request body
 */
export type UnknownRecord<K extends Key> = Record<K, unknown>;

export type ParamsRecord<K extends Key> = Record<K, string>;

export type QueryRecord<K extends Key> = Record<K, string | undefined>;
