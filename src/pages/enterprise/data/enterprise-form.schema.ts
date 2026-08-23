import { z } from "zod";

const nullableText = z.string().nullish().transform((value) => value ?? "");

export const PHONE_REGEX = /^(\+84|0)(3|5|7|8|9)[0-9]{8}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneField = z
  .string()
  .default("")
  .refine((value) => !value || PHONE_REGEX.test(value), {
    message: "Số điện thoại không hợp lệ.",
  });

const emailField = z
  .string()
  .default("")
  .refine((value) => !value || EMAIL_REGEX.test(value), {
    message: "Email không hợp lệ.",
  });

const enterpriseContactSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().default(""),
  phone: phoneField,
  email: emailField,
});

const enterpriseBranchSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  contactId: z.union([z.number(), z.string()]).optional(),
  name: z.string().default(""),
  taxCode: z.string().default(""),
  phone: phoneField,
  taxAddress: z.string().default(""),
  email: emailField,
  address: z.string().default(""),
  note: z.string().default(""),
});

const enterpriseBankAccountSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  bankId: z.union([z.number(), z.string()]).optional(),
  bankName: z.string().default(""),
  accountHolder: z.string().default(""),
  accountNumber: z.string().default(""),
  branch: z.string().default(""),
  note: z.string().default(""),
  bin: z.string().optional(),
  logo: z.string().optional(),
});

const enterpriseDocumentSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().default(""),
  type: z.string().default(""),
  size: z.string().default(""),
  url: z.string().optional(),
  fileName: z.string().optional(),
  fileUrl: z.string().optional(),
  mimeType: z.string().optional(),
  sizeBytes: z.number().optional(),
  content: z.string().nullish(),
});

export const enterpriseFormSchema = z.object({
  type: z.enum(["enterprise", "farm", "cooperative"]),
  organizationTypeId: z.union([
    z.number(),
    z.string().min(1, "Vui lòng chọn loại hình tổ chức."),
  ]),
  code: z.string().trim().min(1, "Vui lòng nhập mã doanh nghiệp."),
  name: z.string().trim().min(1, "Vui lòng nhập tên doanh nghiệp."),
  brandName: nullableText.default(""),
  taxCode: nullableText.default(""),
  taxAddress: nullableText.default(""),
  taxAuthority: nullableText.default(""),
  issueDate: nullableText.default(""),
  classification: z.array(z.string()).default([]),
  foundedDate: nullableText.default(""),
  representative: nullableText.default(""),
  website: nullableText.default(""),
  phone: nullableText.default(""),
  email: nullableText.default(""),
  province: nullableText.default(""),
  ward: nullableText.default(""),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: nullableText.default(""),
  image: nullableText.default(""),
  description: nullableText.default(""),
  contacts: z.array(enterpriseContactSchema).default([]),
  branches: z.array(enterpriseBranchSchema).default([]),
  bankAccounts: z.array(enterpriseBankAccountSchema).default([]),
  documents: z.array(enterpriseDocumentSchema).default([]),
});

export const simpleEnterpriseFormSchema = enterpriseFormSchema.pick({
  image: true,
  code: true,
  name: true,
  taxCode: true,
  organizationTypeId: true,
  province: true,
  ward: true,
  address: true,
  description: true,
}).extend({
  image: z.string().trim().min(1, "Vui lòng tải logo lên."),
  code: z.string().trim().min(1, "Vui lòng nhập mã doanh nghiệp."),
  name: z.string().trim().min(1, "Vui lòng nhập tên doanh nghiệp."),
  taxCode: z.string().trim().min(1, "Vui lòng nhập mã số thuế."),
  province: z.string().trim().min(1, "Vui lòng chọn tỉnh/thành phố."),
  ward: z.string().trim().min(1, "Vui lòng chọn phường/xã."),
  address: z.string().trim().min(1, "Vui lòng nhập địa chỉ chi tiết."),
  description: z.string().optional(),
});

export type EnterpriseFormInput = z.input<typeof enterpriseFormSchema>;
export type EnterpriseFormValues = z.output<typeof enterpriseFormSchema>;

export const defaultEnterpriseFormValues: EnterpriseFormInput = {
  type: "enterprise",
  organizationTypeId: "",
  code: "",
  name: "",
  brandName: "",
  taxCode: "",
  taxAddress: "",
  taxAuthority: "",
  issueDate: "",
  classification: [],
  foundedDate: "",
  representative: "",
  website: "",
  phone: "",
  email: "",
  province: "",
  ward: "",
  latitude: undefined,
  longitude: undefined,
  address: "",
  image: "",
  description: "",
  contacts: [],
  branches: [],
  bankAccounts: [],
  documents: [],
};
