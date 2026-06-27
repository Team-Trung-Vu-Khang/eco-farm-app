import { z } from "zod";

export const ORGANIZATION_FORM_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const organizationFormSchema = z.object({
  code: z.string().trim().min(1, "Vui lòng nhập mã tổ chức."),
  name: z.string().trim().min(1, "Vui lòng nhập tên tổ chức."),
  address: z.string().trim().min(1, "Vui lòng nhập địa chỉ."),
  phone: z.string().trim().min(1, "Vui lòng nhập số điện thoại."),
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập email.")
    .email("Email không hợp lệ."),
  website: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập website.")
    .url("Website không hợp lệ."),
  description: z.string().trim().default(""),
  status: z.enum(ORGANIZATION_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
});

export type OrganizationFormInput = z.input<typeof organizationFormSchema>;
export type OrganizationFormValues = z.output<typeof organizationFormSchema>;
