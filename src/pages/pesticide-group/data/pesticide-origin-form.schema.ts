import { z } from "zod";

export const PESTICIDE_ORIGIN_FORM_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const pesticideOriginFormSchema = z.object({
  code: z.string().trim().min(1, "Vui lòng nhập mã nguồn gốc."),
  name: z.string().trim().min(1, "Vui lòng nhập tên nguồn gốc."),
  description: z.string().trim().default(""),
  status: z.enum(PESTICIDE_ORIGIN_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
});

export type PesticideOriginFormInput = z.input<typeof pesticideOriginFormSchema>;
export type PesticideOriginFormValues =
  z.output<typeof pesticideOriginFormSchema>;
