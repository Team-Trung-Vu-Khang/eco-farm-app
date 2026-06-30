import { z } from "zod";

const enterpriseContactSchema = z.object({
  name: z.string().default(""),
  phone: z.string().default(""),
  email: z.string().default(""),
});

const enterpriseBranchSchema = z.object({
  name: z.string().default(""),
  taxCode: z.string().default(""),
  phone: z.string().default(""),
  taxAddress: z.string().default(""),
  email: z.string().default(""),
  address: z.string().default(""),
  note: z.string().default(""),
});

const enterpriseBankAccountSchema = z.object({
  bankName: z.string().default(""),
  accountHolder: z.string().default(""),
  accountNumber: z.string().default(""),
  branch: z.string().default(""),
  note: z.string().default(""),
  bin: z.string().optional(),
  logo: z.string().optional(),
});

const enterpriseDocumentSchema = z.object({
  name: z.string().default(""),
  type: z.string().default(""),
  size: z.string().default(""),
  url: z.string().optional(),
  fileName: z.string().optional(),
  fileUrl: z.string().optional(),
  mimeType: z.string().optional(),
  sizeBytes: z.number().optional(),
  content: z.string().optional(),
});

export const enterpriseFormSchema = z.object({
  type: z.enum(["enterprise", "farm", "cooperative"]),
  organizationTypeId: z.union([
    z.number(),
    z.string().min(1, "Vui lòng chọn loại hình tổ chức."),
  ]),
  code: z.string().trim().min(1, "Vui lòng nhập mã doanh nghiệp."),
  name: z.string().trim().min(1, "Vui lòng nhập tên doanh nghiệp."),
  brandName: z.string().default(""),
  taxCode: z.string().default(""),
  taxAddress: z.string().default(""),
  taxAuthority: z.string().default(""),
  issueDate: z.string().default(""),
  classification: z.array(z.string()).default([]),
  foundedDate: z.string().default(""),
  representative: z.string().default(""),
  website: z.string().default(""),
  phone: z.string().default(""),
  email: z.string().default(""),
  province: z.string().default(""),
  ward: z.string().default(""),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().default(""),
  image: z.string().default(""),
  description: z.string().default(""),
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
