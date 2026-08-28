import { z } from "zod";

export const BUSINESS_LINE_FORM_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const businessLineFormSchema = z.object({
  code: z.string(),
  name: z.string().trim().min(1, "Vui lòng nhập tên."),
  description: z.string().trim().default(""),
  status: z.enum(BUSINESS_LINE_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
  metadataJson: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type BusinessLineFormInput = z.input<typeof businessLineFormSchema>;
export type BusinessLineFormValues = z.output<typeof businessLineFormSchema>;
