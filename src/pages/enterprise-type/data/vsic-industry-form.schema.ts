import { z } from "zod";

export const VSIC_INDUSTRY_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const vsicIndustryFormSchema = z.object({
  code: z.string().trim().min(1, "Vui lòng nhập mã ngành."),
  name: z.string().trim().min(1, "Vui lòng nhập tên ngành."),
  level: z
    .number()
    .int("Cấp ngành phải là số nguyên.")
    .min(1, "Cấp ngành phải từ 1 đến 5.")
    .max(5, "Cấp ngành phải từ 1 đến 5."),
  parentCode: z.string().trim().optional().transform((value) =>
    value?.length ? value : null,
  ),
  status: z.enum(VSIC_INDUSTRY_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
});

export type VsicIndustryFormInput = z.input<typeof vsicIndustryFormSchema>;
export type VsicIndustryFormValues = z.output<typeof vsicIndustryFormSchema>;
