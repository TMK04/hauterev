import { hash } from "bcryptjs";

import type { PasswordBody, UsernameBody } from "./types";
import type { UserGender } from "database/schemas/types";
import type { UnknownRecord } from "routers/utils/types";

import { bcrypt_config } from "configs";
import { defaultInvalid, validate } from "routers/utils/helpers";

export const salted_hash = (password: string) => hash(password, bcrypt_config.salt);

export const validateUsername = <T extends UsernameBody>(body: T) =>
  validate(body, "username", (v) => {
    if (typeof v !== "string" || v.match(/\W/)) return;
    if (v.length < 20) return v;
  });

export const validatePassword = <T extends PasswordBody>(body: T) =>
  validate(body, "password", (v) => {
    if (typeof v !== "string") return;
    const { length } = v;
    if (length > 8 && length < 50) return v;
  });

export const nullInvalidMobileNumber = <T extends UnknownRecord<"mobile_number">>(body: T) =>
  defaultInvalid(
    body,
    "mobile_number",
    (v) => (typeof v === "number" || typeof v === "string") && v.toString()
  );

const user_genders: readonly UserGender[] = <const>["F", "M", "O", "N"];

export const nullInvalidGender = <T extends UnknownRecord<"gender">>(body: T) =>
  defaultInvalid(body, "gender", (v) => user_genders.includes(<UserGender>v) && <UserGender>v);
