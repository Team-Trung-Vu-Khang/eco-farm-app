import type { PlanTypeFormData } from "../types/types";

export const PLAN_TYPE_STATUS_OPTIONS = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "archived", label: "Đã lưu trữ" },
] as const;

export const emptyPlanTypeFormData: PlanTypeFormData = {
  code: "",
  name: "",
  description: "",
  color: "#10b981",
  displayOrder: 1,
  status: "active",
  planGroupId: "",
};
