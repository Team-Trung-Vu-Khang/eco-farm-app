import { z } from "zod";

export const byProductGroupFormSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, "Vui lòng nhập tên nhóm phụ phẩm"),
  classification: z.string().min(1, "Vui lòng chọn phân loại nhóm"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive", "archived"])
});

export type ByProductGroupFormValues = z.infer<typeof byProductGroupFormSchema>;
