import { z } from "zod";

export const FERTILIZER_GROUP_FORM_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const fertilizerGroupFormSchema = z.object({
  code: z.string().trim().min(1, "Vui lòng nhập mã nhóm."),
  name: z.string().trim().min(1, "Vui lòng nhập tên nhóm."),
  description: z.string().trim().default(""),
  status: z.enum(FERTILIZER_GROUP_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
});

export type FertilizerGroupFormInput = z.input<typeof fertilizerGroupFormSchema>;
export type FertilizerGroupFormValues =
  z.output<typeof fertilizerGroupFormSchema>;
