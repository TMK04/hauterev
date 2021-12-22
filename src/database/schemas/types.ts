import type { Knex } from "knex";

export type RawDefault = Knex.Raw<"DEFAULT">;

/**
 * @type {INT}
 */
export type ID = number;
/**
 * @type {VARCHAR(50)}
 */
export type Name = string;
/**
 * @type {VARCHAR(255)}
 */
export type ImageURL = string;
/**
 * @type {TIMESTAMP}
 */
export type Timestamp = Date;

export * from "./bookmark-schema/types";
export * from "./helpful-mark-schema/types";
export * from "./restaurant-schema/types";
export * from "./review-schema/types";
export * from "./user-schema/types";
