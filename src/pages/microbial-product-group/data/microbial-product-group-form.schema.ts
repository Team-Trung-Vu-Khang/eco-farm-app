import { z } from "zod";

export const FERTILIZER_GROUP_FORM_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const microbialProductGroupFormSchema = z.object({
  code: z.string().trim().optional(),
  name: z.string().trim().min(1, "Vui lòng nhập tên nhóm."),
  description: z.string().trim().default(""),
  status: z.enum(FERTILIZER_GROUP_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
});

export type MicrobialProductGroupFormInput = z.input<typeof microbialProductGroupFormSchema>;
export type MicrobialProductGroupFormValues =
  z.output<typeof microbialProductGroupFormSchema>;
