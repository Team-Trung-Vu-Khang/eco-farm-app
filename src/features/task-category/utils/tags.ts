/** string[] → ",a,b," (bọc dấu phẩy đầu/cuối để filter đúng 1 tag không khớp nhầm chuỗi con). */
export const serializeTaskCategoryTags = (tags: string[]): string | undefined => {
  const cleaned = tags.map((tag) => tag.trim()).filter(Boolean);
  return cleaned.length ? `,${cleaned.join(",")},` : undefined;
};

/** ",a,b," → ["a", "b"] */
export const parseTaskCategoryTags = (tags?: string | null): string[] =>
  (tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
