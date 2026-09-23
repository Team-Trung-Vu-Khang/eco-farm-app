/** "Cải tạo đất" → "CAITAODAT": bỏ dấu, viết hoa, bỏ ký tự không phải chữ/số. */
export const toTagCode = (label: string) =>
  label
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "D")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

/** Tag kèm prefix để biết nguồn liên kết, VD: buildTag("group", "Canh tác") → "group-CANHTAC". */
export const buildTag = (prefix: string, label: string) =>
  `${prefix}-${toTagCode(label)}`;
