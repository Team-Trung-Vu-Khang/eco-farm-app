export const normalizeSku = (value?: string) =>
  value?.trim().toUpperCase() ?? "";