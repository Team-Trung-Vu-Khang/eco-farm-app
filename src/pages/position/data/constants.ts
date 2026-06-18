import type { PositionFormData } from "../types/types";

export const POSITION_GROUPS = [
  "Nhóm quản lý – điều hành",
  "Nhóm kỹ thuật trồng trọt",
  "Nhóm bảo vệ thực vật",
  "Nhóm đất – phân bón – dinh dưỡng",
  "Nhóm tưới – hệ thống – nhà màng",
  "Nhóm giống – vườn ươm",
  "Nhóm thu hoạch – sơ chế – chất lượng",
  "Nhóm tiêu chuẩn – chứng nhận – truy xuất",
  "Nhóm kho – vật tư – logistics",
  "Nhóm cơ giới – bảo trì",
  "Nhóm lao động trực tiếp",
] as const;

export const POSITION_STATUS_OPTIONS = [
  { label: "Hoạt động", value: "active" },
  { label: "Ngừng hoạt động", value: "inactive" },
] as const;

export const emptyPositionFormData: PositionFormData = {
  code: "",
  name: "",
  group: "",
  description: "",
  responsibilities: [],
  status: "active",
};
