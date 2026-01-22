export const dateFormat = (date: string | number | Date) => {
  return new Intl.DateTimeFormat("vi", {
    day: "2-digit",
    year: "numeric",
    month: "2-digit",
  }).format(date instanceof Date ? date : new Date(date));
};

export const deepClone = (value: unknown) => {
  if (!value) {
    return value;
  }

  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
};
