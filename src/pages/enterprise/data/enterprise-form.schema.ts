import { z } from "zod";

const nullableText = z
  .string()
  .nullish()
  .transform((value) => value ?? "");

const enterpriseContactSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().default(""),
  phone: z.string().default(""),
  email: z.string().default(""),
});

const enterpriseBranchSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  contactId: z.union([z.number(), z.string()]).optional(),
  name: z.string().default(""),
  taxCode: z.string().trim().min(1, "Vui lòng nhập mã số thuế chi nhánh."),
  phone: z.string().trim().min(1, "Vui lòng nhập số điện thoại chi nhánh."),
  taxAddress: z.string().trim().min(1, "Vui lòng nhập địa chỉ thuế."),
  email: z.string().default(""),
  address: z.string().trim().min(1, "Vui lòng nhập địa chỉ chi nhánh."),
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
  code: z.string().trim().optional().default(""),
  name: z.string().trim().min(1, "Vui lòng nhập tên doanh nghiệp."),
  brandName: nullableText.default(""),
  aliasName: nullableText.default(""),
  taxCode: z.string().trim().min(1, "Vui lòng nhập mã số thuế."),
  taxAddress: z.string().trim().min(1, "Vui lòng nhập địa chỉ thuế."),
  taxAuthority: z.string().trim().min(1, "Vui lòng nhập cơ quan thuế."),
  issueDate: z.string().trim().min(1, "Vui lòng chọn ngày cấp."),
  classification: z
    .array(z.string())
    .min(1, "Vui lòng chọn ít nhất một phân loại."),
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
