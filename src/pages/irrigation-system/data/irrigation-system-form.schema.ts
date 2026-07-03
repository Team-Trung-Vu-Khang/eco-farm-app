import { z } from "zod";

export const IRRIGATION_SYSTEM_FORM_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const irrigationSystemFormSchema = z.object({
  code: z.string().trim().min(1, "Vui lòng nhập mã hệ thống."),
  name: z.string().trim().min(1, "Vui lòng nhập tên hệ thống."),
  description: z.string().trim().default(""),
  status: z.enum(IRRIGATION_SYSTEM_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
});

export type IrrigationSystemFormInput = z.input<
  typeof irrigationSystemFormSchema
>;
export type IrrigationSystemFormValues = z.output<
  typeof irrigationSystemFormSchema
>;
