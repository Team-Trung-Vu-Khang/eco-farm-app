import { z } from "zod";

export const PESTICIDE_PURPOSE_FORM_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const pesticidePurposeFormSchema = z.object({
  code: z.string().trim().min(1, "Vui lòng nhập mã công dụng."),
  name: z.string().trim().min(1, "Vui lòng nhập tên công dụng."),
  description: z.string().trim().default(""),
  status: z.enum(PESTICIDE_PURPOSE_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
});

export type PesticidePurposeFormInput = z.input<typeof pesticidePurposeFormSchema>;
export type PesticidePurposeFormValues = z.output<typeof pesticidePurposeFormSchema>;
