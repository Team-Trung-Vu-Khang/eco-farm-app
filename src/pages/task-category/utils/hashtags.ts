/** "Cải tạo đất" → "CAITAODAT": bỏ dấu, viết hoa, bỏ ký tự không phải chữ/số. */
export const toTagCode = (label: string) =>
  label
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "D")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

/**
 * Tag lưu dạng `<LOẠI CÔNG VIỆC>:<Tên công việc>`,
 * VD: buildTaskCategoryTag("DINHDUONG", "Bón phân") → "DINHDUONG:Bón phân".
 * Bỏ dấu phẩy trong tên vì tags được nối bằng dấu phẩy.
 */
export const buildTaskCategoryTag = (typeCode: string, taskName: string) =>
  `${typeCode}:${taskName.replace(/,/g, " ").trim()}`;

/**
 * Lấy mã loại công việc từ tag: "DINHDUONG:Bón phân" → "DINHDUONG".
 * Vẫn đọc được tag cũ dạng "group-DINHDUONG".
 */
export const getTaskCategoryTagType = (tag: string) => {
  const [typeCode] = tag.split(":");
  return typeCode.replace(/^group-/, "");
};
