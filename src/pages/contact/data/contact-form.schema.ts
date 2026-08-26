import { z } from "zod";

export const contactFormSchema = z.object({
  entityName: z.string().trim().min(1, "Vui lòng chọn đơn vị sở hữu."),
  groupIds: z.array(z.string()).default([]),
  department: z.string().default(""),
  position: z.string().trim().default(""),
  fullName: z.string().trim().min(1, "Vui lòng nhập họ và tên."),
  phone: z.string().trim().min(1, "Vui lòng nhập số điện thoại."),
  email: z.union([z.string().trim().email("Email không hợp lệ."), z.literal("")]).default(""),
  note: z.string().trim().default(""),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type ContactFormInput = z.input<typeof contactFormSchema>;
export type ContactFormValues = z.output<typeof contactFormSchema>;
