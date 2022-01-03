import { hash } from "bcryptjs";

import type { UsernameBody } from "./types";
import type { UserGender } from "database/schemas/types";
import type { UnknownRecord } from "routers/utils/types";

import { bcrypt_config } from "configs";
import { rawDefaultInvalid, validate } from "routers/utils/helpers";

export const salted_hash = (password: string) => hash(password, bcrypt_config.salt);

// ---------------------------- //
// * validate Implementations * //
// ---------------------------- //

export const validateUsername = <T extends UsernameBody>(body: T) =>
  validate(body, "username", (v) => {
    if (typeof v !== "string" || v.match(/\W/)) return;
    if (v.length < 20) return v;
  });

export const validatePassword = <T extends UnknownRecord<A>, A extends string>(
  body: T,
  alias: A = <A>"password"
) =>
  validate(body, alias, (v) => {
    if (typeof v !== "string" || v.match(/\s/)) return;
    const { length } = v;
    if (length > 8 && length < 50) return v;
  });

export const rawDefaultInvalidMobileNumber = <T extends UnknownRecord<"mobile_number">>(body: T) =>
  rawDefaultInvalid(
    body,
    "mobile_number",
    (v) => (typeof v === "number" || typeof v === "string") && v.toString()
  );

const user_genders: readonly UserGender[] = <const>["F", "M", "O", "N"];

export const rawDefaultInvalidGender = <T extends UnknownRecord<"gender">>(body: T) =>
  rawDefaultInvalid(body, "gender", (v: any) => user_genders.includes(v) && <UserGender>v);
