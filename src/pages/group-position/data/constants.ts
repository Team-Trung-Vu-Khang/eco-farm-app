import type { PositionGroupFormData } from "../types";

export const POSITION_GROUP_STATUS_OPTIONS = [
  { label: "Hoạt động", value: "active" },
  { label: "Ngừng hoạt động", value: "inactive" },
  { label: "Đã lưu trữ", value: "archived" },
];
export const emptyPositionGroupFormData: PositionGroupFormData = {
  code: "",
  name: "",
  description: "",
  status: "active",
};
