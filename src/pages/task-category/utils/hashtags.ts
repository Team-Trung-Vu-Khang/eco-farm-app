import type { TaskCategoryRecord } from "@/features/task-category";

/** Hashtags được lưu trong `metadataJson.hashtags` (backend chưa có field riêng). */
export const getTaskCategoryHashtags = (
  item: Pick<TaskCategoryRecord, "metadataJson">,
): string[] => {
  const hashtags = item.metadataJson?.hashtags;
  return Array.isArray(hashtags)
    ? hashtags.filter((tag): tag is string => typeof tag === "string")
    : [];
};

/** Bỏ dấu # đầu, khoảng trắng thừa; khoảng trắng giữa chữ đổi thành "_". */
export const normalizeHashtag = (value: string) =>
  value.trim().replace(/^#+/, "").trim().replace(/\s+/g, "_");
