/** string[] → "a,b" */
export const serializeTaskCategoryTags = (tags: string[]): string | undefined => {
  const cleaned = tags.map((tag) => tag.trim()).filter(Boolean);
  return cleaned.length ? cleaned.join(",") : undefined;
};

/** "a,b" → ["a", "b"] (vẫn đọc được dữ liệu cũ dạng ",a,b,") */
export const parseTaskCategoryTags = (tags?: string | null): string[] =>
  (tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
