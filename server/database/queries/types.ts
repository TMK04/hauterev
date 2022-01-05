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

export * from "./bookmark-queries/types";
export * from "./helpful-mark-queries/types";
export * from "./restaurant-queries/types";
export * from "./review-queries/types";
export * from "./user-queries/types";
