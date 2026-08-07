import { z } from "zod";

export const MEDICINE_CATEGORY_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const medicineCategoryFormSchema = z.object({
  code: z.string().trim(),
  name: z.string().trim().min(1, "Vui lòng nhập tên phân loại."),
  description: z.string().trim().default(""),
  status: z.enum(MEDICINE_CATEGORY_STATUSES, {
    required_error: "Vui lòng chọn trạng thái",
  }),
});

export type MedicineCategoryFormInput = z.input<typeof medicineCategoryFormSchema>;
export type MedicineCategoryFormValues = z.output<typeof medicineCategoryFormSchema>;

export const emptyMedicineCategoryFormData: MedicineCategoryFormInput = {
  code: "",
  name: "",
  description: "",
  status: "active",
};
