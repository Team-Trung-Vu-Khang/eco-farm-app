import { z } from "zod";

export const ENTERPRISE_FORM_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const enterpriseFormSchema = z.object({
  code: z.string().trim().min(1, "Vui lòng nhập mã."),
  name: z.string().trim().min(1, "Vui lòng nhập tên."),
  description: z.string().trim().default(""),
  status: z.enum(ENTERPRISE_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
  metadataJson: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type EnterpriseFormInput = z.input<typeof enterpriseFormSchema>;
export type EnterpriseFormValues = z.output<typeof enterpriseFormSchema>;
