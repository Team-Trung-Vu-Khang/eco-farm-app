import { z } from "zod";

export const POSITION_FORM_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const positionFormSchema = z.object({
  code: z.string().trim().min(1, "Vui lòng nhập mã chức vụ."),
  name: z.string().trim().min(1, "Vui lòng nhập tên chức vụ."),
  group: z.string().trim().min(1, "Vui lòng chọn nhóm chức vụ."),
  description: z.string().trim(),
  responsibilities: z.array(z.string()).default([]),
  status: z.enum(POSITION_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
});

export type PositionFormValues = z.infer<typeof positionFormSchema>;
