export const stringValidateCallback = (v: unknown) => typeof v === "string" && v;

export const numberValidateCallback = (v: unknown) => typeof v === "number" && isFinite(v) && v;
