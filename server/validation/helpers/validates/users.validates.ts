import type { UserGender } from "db/types";
import type { UnknownRecord } from "helpers/types";
import type { UsernameBody } from "types";

import validate from "validation/utils/validate";

import { rawDefaultInvalid } from "./wrappers.validates";

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

const user_genders: readonly UserGender[] = <const>["F", "M", "O", "N"];

export const rawDefaultInvalidGender = <T extends UnknownRecord<"gender">>(body: T) =>
  rawDefaultInvalid(body, "gender", (v: any) => user_genders.includes(v) && <UserGender>v);
