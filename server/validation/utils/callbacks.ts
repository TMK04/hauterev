export const stringValidateCallback = (v: unknown) => typeof v === "string" && v;

export const numberValidateCallback = (v: unknown) => {
  if (typeof v === "string") v = +v;
  if (typeof v === "number" && isFinite(v)) return v;
};
