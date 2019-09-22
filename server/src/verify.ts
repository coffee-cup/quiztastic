export const verifyString = (value: any): boolean => {
  return value != null || typeof value === "string";
};
