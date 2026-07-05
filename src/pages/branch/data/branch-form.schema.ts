import { z } from "zod";

import type {
  BranchBankRequest,
  BranchContactRequest,
  BranchCreateRequest,
  BranchRecord,
  BranchStatus,
  BranchUpdateRequest,
} from "@/features/branch";
import { buildBranchFullAddress } from "../utils/form";

export const BRANCH_FORM_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

const branchContactFormSchema = z.object({
  contactId: z.union([z.string(), z.number()]).optional(),
  name: z.string().trim().default(""),
  position: z.string().trim().default(""),
  phone: z.string().trim().default(""),
  email: z.string().trim().default(""),
  isPrimary: z.boolean().default(false),
});

const branchBankFormSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  bankAccountId: z.union([z.string(), z.number()]).optional(),
  bankId: z.union([z.string(), z.number()]).optional(),
  ownerType: z.string().trim().default(""),
  ownerId: z.union([z.string(), z.number()]).optional(),
  bankCode: z.string().trim().default(""),
  bankName: z.string().trim().default(""),
  bin: z.string().trim().default(""),
  accountNumber: z.string().trim().default(""),
  accountHolder: z.string().trim().default(""),
  branch: z.string().trim().default(""),
  note: z.string().trim().default(""),
  logoUrl: z.string().trim().default(""),
  status: z.enum(BRANCH_FORM_STATUSES).default("active"),
  isPrimary: z.boolean().default(false),
  metadataJson: z.record(z.string(), z.unknown()).nullable().default(null),
});

export const branchFormSchema = z.object({
  organizationId: z.string().trim().min(1, "Vui lòng chọn đơn vị chủ quản."),
  code: z.string().trim().min(1, "Vui lòng nhập mã chi nhánh."),
  name: z.string().trim().min(1, "Vui lòng nhập tên chi nhánh."),
  taxCode: z.string().trim().default(""),
  taxAddress: z.string().trim().default(""),
  website: z.string().trim().default(""),
  address: z.string().trim().default(""),
  city: z.string().trim().default(""),
  district: z.string().trim().default(""),
  ward: z.string().trim().default(""),
  imageUrl: z.string().trim().default(""),
  latitude: z.number().default(0),
  longitude: z.number().default(0),
  status: z.enum(BRANCH_FORM_STATUSES).default("active"),
  contacts: z.array(branchContactFormSchema).default([]),
  bankAccounts: z.array(branchBankFormSchema).default([]),
  metadataJson: z.record(z.string(), z.unknown()).nullable().default(null),
});

export type BranchFormInput = z.input<typeof branchFormSchema>;
export type BranchFormValues = z.output<typeof branchFormSchema>;

export const emptyBranchFormValues: BranchFormInput = {
  organizationId: "",
  code: "",
  name: "",
  taxCode: "",
  taxAddress: "",
  website: "",
  address: "",
  city: "",
  district: "",
  ward: "",
  imageUrl: "",
  latitude: 0,
  longitude: 0,
  status: "active",
  contacts: [],
  bankAccounts: [],
  metadataJson: null,
};

const isFilledContact = (contact: BranchContactRequest) =>
  Boolean(contact.contactId || contact.name || contact.position || contact.phone || contact.email);

const isFilledBankAccount = (bankAccount: BranchBankRequest) =>
  Boolean(
    bankAccount.id ||
      bankAccount.bankCode ||
      bankAccount.bankName ||
      bankAccount.accountNumber ||
      bankAccount.accountHolder ||
      bankAccount.branch ||
      bankAccount.note ||
      bankAccount.logoUrl,
  );

function dedupeContacts(contacts: BranchContactRequest[]) {
  const seen = new Set<string>();

  return contacts.filter((contact) => {
    const key = [
      (contact.name ?? "").trim().toLowerCase(),
      (contact.phone ?? "").trim(),
      (contact.email ?? "").trim().toLowerCase(),
    ].join("|");

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function ensurePrimaryContact<T extends { isPrimary?: boolean }>(
  items: T[],
): Array<T & { isPrimary: boolean }> {
  if (items.length === 0) {
    return items as Array<T & { isPrimary: boolean }>;
  }

  if (items.some((item) => item.isPrimary)) {
    return items as Array<T & { isPrimary: boolean }>;
  }

  return items.map((item, index) => ({
    ...item,
    isPrimary: index === 0,
  }));
}

export function createBranchFormValues(
  branch?: BranchRecord | null,
): BranchFormInput {
  if (!branch) return emptyBranchFormValues;

  return {
    organizationId: String(branch.organizationId ?? branch.organization?.id ?? ""),
    code: branch.code ?? "",
    name: branch.name ?? "",
    taxCode: branch.taxCode ?? "",
    taxAddress: branch.taxAddress ?? "",
    website: branch.website ?? "",
    address: branch.address ?? "",
    city: branch.city ?? "",
    district: branch.district ?? "",
    ward: branch.ward ?? "",
    imageUrl: branch.imageUrl ?? "",
    latitude: branch.latitude ?? 0,
    longitude: branch.longitude ?? 0,
    status: branch.status === "inactive" ? "inactive" : "active",
    contacts: (branch.contacts ?? []).map((contact) => ({
      contactId: contact.id,
      name: contact.name || contact.fullName || "",
      position: contact.position || "",
      phone: contact.phone || "",
      email: contact.email || "",
      isPrimary: Boolean(contact.isPrimary),
    })),
    bankAccounts: (branch.bankAccounts ?? []).map((bankAccount) => ({
      id: bankAccount.id,
      bankAccountId: bankAccount.id,
      bankId: bankAccount.bank?.id,
      ownerType: bankAccount.ownerType ?? "",
      ownerId: bankAccount.ownerId,
      bankCode: bankAccount.bank?.code ?? bankAccount.bankCode ?? "",
      bankName: bankAccount.bank?.shortName ?? bankAccount.bank?.name ?? bankAccount.bankName ?? "",
      bin: bankAccount.bank?.bin ?? bankAccount.bin ?? "",
      accountNumber: bankAccount.accountNumber ?? "",
      accountHolder: bankAccount.accountHolder ?? "",
      branch: bankAccount.branch ?? "",
      note: bankAccount.note ?? "",
      logoUrl: bankAccount.bank?.logoUrl ?? bankAccount.logoUrl ?? "",
      status: (bankAccount.status as BranchStatus) ?? "active",
      isPrimary: Boolean(bankAccount.isPrimary),
      metadataJson: bankAccount.metadataJson ?? null,
    })),
    metadataJson: branch.metadataJson ?? null,
  };
}

export function buildBranchPayload(
  values: BranchFormValues,
  branchId?: number | string,
): BranchCreateRequest | BranchUpdateRequest {
  const contacts = ensurePrimaryContact(
    dedupeContacts(values.contacts.filter(isFilledContact)).map<BranchContactRequest>(
      (contact) => ({
        contactId: contact.contactId,
        name: contact.name.trim(),
        position: contact.position.trim() || undefined,
        phone: contact.phone.trim() || undefined,
        email: contact.email.trim() || undefined,
        isPrimary: contact.isPrimary,
      }),
    ),
  );

  const bankAccounts = ensurePrimaryContact(
    values.bankAccounts
      .filter(isFilledBankAccount)
      .map<BranchBankRequest>((bankAccount) => ({
        id: bankAccount.bankAccountId,
        bankId: bankAccount.bankId,
        ownerType: bankAccount.ownerType || undefined,
        ownerId: bankAccount.ownerId,
        bankCode: bankAccount.bankCode.trim(),
        bankName: bankAccount.bankName.trim(),
        bin: bankAccount.bin.trim() || undefined,
        accountNumber: bankAccount.accountNumber.trim(),
        accountHolder: bankAccount.accountHolder.trim(),
        branch: bankAccount.branch.trim() || undefined,
        note: bankAccount.note.trim() || undefined,
        logoUrl: bankAccount.logoUrl.trim() || undefined,
        status: bankAccount.status,
        isPrimary: bankAccount.isPrimary,
        metadataJson: bankAccount.metadataJson,
      })),
  );

  const address = buildBranchFullAddress({
    address: values.address,
    ward: values.ward,
    district: values.district,
    city: values.city,
  });

  const payload: BranchCreateRequest = {
    ...(branchId ? { id: branchId } : {}),
    organizationId: Number(values.organizationId),
    code: values.code.trim(),
    name: values.name.trim(),
    taxCode: values.taxCode.trim() || undefined,
    taxAddress: values.taxAddress.trim() || undefined,
    website: values.website.trim() || undefined,
    address: address || values.address.trim() || undefined,
    city: values.city.trim() || undefined,
    district: values.district.trim() || undefined,
    ward: values.ward.trim() || undefined,
    imageUrl: values.imageUrl.trim() || undefined,
    latitude: values.latitude,
    longitude: values.longitude,
    status: values.status,
    contacts,
    bankAccounts,
    metadataJson: values.metadataJson,
  };

  return payload;
}
