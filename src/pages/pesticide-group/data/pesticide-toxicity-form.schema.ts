import { z } from "zod";

export const PESTICIDE_TOXICITY_FORM_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const PESTICIDE_WHO_GROUP_OPTIONS = ["Ia", "Ib", "II", "III", "IV"] as const;

export const pesticideToxicityFormSchema = z.object({
  code: z.string().trim().min(1, "Vui lòng nhập mã phân loại."),
  name: z.string().trim().min(1, "Vui lòng nhập tên phân loại."),
  description: z.string().trim().default(""),
  status: z.enum(PESTICIDE_TOXICITY_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
  whoGroup: z.enum(PESTICIDE_WHO_GROUP_OPTIONS, {
    message: "Vui lòng chọn nhóm WHO.",
  }),
  bandColor: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập màu băng.")
    .default("#3B82F6"),
  ld50Threshold: z.string().trim().min(1, "Vui lòng nhập ngưỡng LD50."),
});

export type PesticideToxicityFormInput = z.input<
  typeof pesticideToxicityFormSchema
>;
export type PesticideToxicityFormValues = z.output<
  typeof pesticideToxicityFormSchema
>;
