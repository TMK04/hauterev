export const isDefined = (value: unknown) => typeof value !== "undefined";

export const isEmpty = <T extends object>(data: Partial<T>) => {
  for (const key in data) {
    if (data[key]) return false;
  }
  return true;
};
