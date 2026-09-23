/**
 * Normalizes a SKU / Product Code string:
 * 1. Removes Vietnamese diacritics/accents (e.g., 'Phân Bón' -> 'PHAN_BON', 'Đ' -> 'D')
 * 2. Replaces spaces with underscores '_', collapsing multiple spaces into a single '_'
 * 3. Converts any other non-alphanumeric characters to hyphens '-'
 * 4. Converts to UPPERCASE
 */
export const normalizeSku = (value?: string): string => {
  if (!value) return "";
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]+/g, "-")
    .replace(/-+/g, "-")
    .toUpperCase();
};
