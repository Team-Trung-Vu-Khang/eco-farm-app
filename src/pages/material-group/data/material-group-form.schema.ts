import { z } from "zod";

export const MATERIAL_GROUP_FORM_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const materialGroupFormSchema = z.object({
  code: z.string().trim().min(1, "Vui lòng nhập mã nhóm."),
  name: z.string().trim().min(1, "Vui lòng nhập tên nhóm."),
  description: z.string().trim().default(""),
  status: z.enum(MATERIAL_GROUP_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
});

export type MaterialGroupFormInput = z.input<typeof materialGroupFormSchema>;
export type MaterialGroupFormValues = z.output<typeof materialGroupFormSchema>;
