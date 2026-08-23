import type { PositionFormData } from "../types";

export const POSITION_STATUS_OPTIONS = [
  { label: "Hoạt động", value: "active" },
  { label: "Ngừng hoạt động", value: "inactive" },
  { label: "Đã lưu trữ", value: "archived" },
] as const;

export const emptyPositionFormData: PositionFormData = {
  name: "",
  positionGroupId: "",
  description: "",
  responsibilityDescription: "",
  displayOrder: 1,
  documents: [],
  status: "active",
};
