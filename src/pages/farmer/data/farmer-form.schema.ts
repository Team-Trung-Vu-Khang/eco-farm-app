import { z } from "zod";

import type { FarmerFormData } from "../types";

const emptyText = () =>
  z.preprocess((value) => (value === null ? "" : value), z.string().trim().default(""));

const optionalNumber = () =>
  z.preprocess(
    (value) => (value === null || value === "" ? undefined : value),
    z.number().optional(),
  );

const contactSchema = z.object({
  id: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.union([z.string(), z.number()]).optional(),
  ),
  name: emptyText(),
  phone: emptyText(),
  email: emptyText(),
});

const branchSchema = z.object({
  name: emptyText(),
  taxCode: emptyText(),
  phone: emptyText(),
  taxAddress: emptyText(),
  email: emptyText(),
  address: emptyText(),
  note: emptyText(),
});

const bankAccountSchema = z.object({
  id: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.union([z.string(), z.number()]).optional(),
  ),
  bankId: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.union([z.string(), z.number()]).optional(),
  ),
  bankName: emptyText(),
  accountHolder: emptyText(),
  accountNumber: emptyText(),
  branch: emptyText(),
  note: emptyText(),
  bin: emptyText(),
  logo: emptyText(),
});

const documentSchema = z.object({
  name: emptyText(),
  type: emptyText(),
  size: emptyText(),
  url: emptyText(),
  fileName: emptyText(),
  fileUrl: emptyText(),
  mimeType: emptyText(),
  sizeBytes: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.number().int().nonnegative().optional(),
  ),
  content: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.string().trim().optional(),
  ),
});

export const farmerFormSchema = z.object({
  type: z.enum(["enterprise", "farm", "cooperative"]).default("farm"),
  code: z.preprocess(
    (value) => (value === null ? "" : value),
    z.string().trim().min(1, "Vui lòng nhập mã nông hộ."),
  ),
  name: z.preprocess(
    (value) => (value === null ? "" : value),
    z.string().trim().min(1, "Vui lòng nhập tên nông hộ."),
  ),
  brandName: emptyText(),
  taxCode: emptyText(),
  taxAddress: emptyText(),
  taxAuthority: emptyText(),
  issueDate: emptyText(),
  classification: z
    .array(z.enum(["production", "processing", "trading", "service", "other"]))
    .default([]),
  foundedDate: emptyText(),
  representative: emptyText(),
  website: emptyText(),
  phone: z.preprocess(
    (value) => (value === null ? "" : value),
    z.string().trim().min(1, "Vui lòng nhập số điện thoại."),
  ),
  email: emptyText(),
  province: z.preprocess(
    (value) => (value === null ? "" : value),
    z.string().trim().min(1, "Vui lòng chọn tỉnh/thành phố."),
  ),
  district: emptyText(),
  ward: z.preprocess(
    (value) => (value === null ? "" : value),
    z.string().trim().min(1, "Vui lòng chọn phường/xã."),
  ),
  latitude: optionalNumber(),
  longitude: optionalNumber(),
  address: emptyText(),
  image: emptyText(),
  description: emptyText(),
  contacts: z.array(contactSchema).default([]),
  branches: z.array(branchSchema).default([]),
  bankAccounts: z.array(bankAccountSchema).default([]),
  documents: z.array(documentSchema).default([]),
});

export const defaultFarmerFormValues: FarmerFormData = {
  type: "farm",
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
  district: "",
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

export type FarmerFormInput = z.input<typeof farmerFormSchema>;
export type FarmerFormValues = z.output<typeof farmerFormSchema>;
