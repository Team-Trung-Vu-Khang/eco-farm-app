import type { IrrigationSystemFormValues } from "./irrigation-system-form.schema";

export const IRRIGATION_SYSTEM_STATUS_OPTIONS = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "archived", label: "Đã lưu trữ" },
] as const;

export const emptyIrrigationSystemFormData: IrrigationSystemFormValues = {
  code: "",
  name: "",
  description: "",
  status: "active",
};
