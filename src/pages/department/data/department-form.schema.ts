import { z } from "zod";

export const DEPARTMENT_FORM_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const departmentFormSchema = z.object({
  code: z.string().trim().min(1, "Vui lòng nhập mã phòng ban."),
  name: z.string().trim().min(1, "Vui lòng nhập tên phòng ban."),
  description: z.string().trim(),
  status: z.enum(DEPARTMENT_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;
