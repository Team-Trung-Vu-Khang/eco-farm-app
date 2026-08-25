import type {
  OrganizationRecord,
} from "@/features/organization";
import type {
  BankAccount,
  Branch,
  Contact,
  CooperativeFormData,
} from "../types/types";
import type { Enterprise } from "@/pages/enterprise/data/constants";

const toTextSize = (sizeBytes?: number, fallback = "") => {
  if (!sizeBytes) return fallback;
  return `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`;
};

export type CooperativeRow = Omit<Enterprise, "classification"> & {
  classification: Enterprise["classification"];
  businessLine: string;
  businessLineText: string;
  primaryPhone: string;
  primaryEmail: string;
  image: string;
};

export const mapOrganizationBusinessLinesToClassification = (
  businessLines: OrganizationRecord["businessLines"] | undefined,
): Enterprise["classification"] =>
  (businessLines ?? []).map((line) => String(line.id));

export const mapClassificationToBusinessLines = (
  classifications: string[],
  businessLineRecords: OrganizationRecord["businessLines"] | undefined,
) =>
  classifications.flatMap((businessLineId) => {
    const record = businessLineRecords?.find(
      (item) => String(item.id) === businessLineId,
    );

    return record ? [record] : [];
  });

export const toCooperativeRow = (
  cooperative: OrganizationRecord,
  selectedBusinessLine = "all",
): CooperativeRow => {
  const primaryContact =
    cooperative.contacts?.find((contact) => contact.isPrimary) ??
    cooperative.contacts?.[0] ??
    null;

  const firstBusinessLine =
    cooperative.businessLines?.find((line) => line.code || line.name) ?? null;
  const businessLineValue =
    selectedBusinessLine !== "all"
      ? selectedBusinessLine
      : firstBusinessLine?.code || firstBusinessLine?.name || "-";

  return {
    id: Number(cooperative.id),
    code: cooperative.code,
    name: cooperative.name,
    image: cooperative.imageUrl || "",
    type: "cooperative",
    classification: mapOrganizationBusinessLinesToClassification(
      cooperative.businessLines,
    ),
    taxCode: cooperative.taxCode,
    address: cooperative.address,
    phone: primaryContact?.phone || "",
    email: primaryContact?.email || "",
    status: cooperative.status === "inactive" ? "inactive" : "active",
    createdAt: cooperative.createdAt,
    aliasName: cooperative.aliasName,
    brandName: cooperative.brandName,
    representative: cooperative.representative,
    foundedDate: cooperative.foundedDate,
    website: cooperative.website,
    province: cooperative.province,
    district: cooperative.district || cooperative.ward || "",
    ward: cooperative.ward,
    latitude: cooperative.latitude,
    longitude: cooperative.longitude,
    taxAddress: cooperative.taxAddress,
    taxAuthority: cooperative.taxAuthority,
    issueDate: cooperative.issueDate,
    description: cooperative.description,
    contacts:
      cooperative.contacts?.map((contact) => ({
        id: contact.id,
        name: contact.name || contact.fullName || "",
        phone: contact.phone || "",
        email: contact.email || "",
      })) ?? [],
    branches:
      cooperative.branches?.map((branch) => ({
        id: branch.id,
        contactId: branch.contacts?.[0]?.id,
        name: branch.name || "",
        taxCode: branch.taxCode || "",
        phone: branch.contacts?.[0]?.phone || "",
        taxAddress: branch.taxAddress || "",
        email: branch.contacts?.[0]?.email || "",
        address: branch.address || "",
        note: branch.metadataJson?.note ? String(branch.metadataJson.note) : "",
      })) ?? [],
    bankAccounts:
      cooperative.bankAccounts?.map((account) => ({
        id: account.id,
        bankId: account.bank?.id,
        bankName: account.bank?.shortName || account.bank?.name || "",
        accountHolder: account.accountHolder || "",
        accountNumber: account.accountNumber || "",
        branch: account.branch || "",
        note: account.note || "",
        bin: account.bank?.bin || "",
        logo: account.bank?.logoUrl || "",
      })) ?? [],
    documents:
      cooperative.documents?.map((doc) => ({
        id: doc.id,
        name: doc.name || "",
        type: doc.mimeType || doc.documentType || "",
        size: toTextSize(doc.sizeBytes, ""),
        url: doc.fileUrl || "",
        fileName: doc.fileName || doc.name || "",
        fileUrl: doc.fileUrl || "",
        mimeType: doc.mimeType || doc.documentType || "",
        sizeBytes: doc.sizeBytes,
        content: doc.content,
      })) ?? [],
    businessLine: businessLineValue,
    businessLineText:
      cooperative.businessLines
        ?.map((line) => line.name)
        .filter(Boolean)
        .join(", ") || "-",
    primaryPhone: primaryContact?.phone || "-",
    primaryEmail: primaryContact?.email || "-",
  };
};

export const toCooperativeFormData = (
  cooperative: OrganizationRecord,
): Partial<CooperativeFormData> => {
  const primaryContact =
    cooperative.contacts?.find((contact) => contact.isPrimary) ??
    cooperative.contacts?.[0] ??
    null;

  return {
    id: cooperative.id,
    type: "cooperative",
    code: cooperative.code,
    name: cooperative.name,
    aliasName: cooperative.aliasName || "",
    brandName: cooperative.brandName || "",
    taxCode: cooperative.taxCode || "",
    taxAddress: cooperative.taxAddress || "",
    taxAuthority: cooperative.taxAuthority || "",
    issueDate: cooperative.issueDate || "",
    classification: mapOrganizationBusinessLinesToClassification(
      cooperative.businessLines,
    ),
    foundedDate: cooperative.foundedDate || "",
    representative: cooperative.representative || "",
    website: cooperative.website || "",
    phone: primaryContact?.phone || "",
    email: primaryContact?.email || "",
    province: cooperative.province || "",
    district: cooperative.district || cooperative.ward || "",
    address: cooperative.address || "",
    image: cooperative.imageUrl || "",
    description: cooperative.description || "",
    contacts:
      cooperative.contacts?.map((contact): Contact => ({
        id: contact.id,
        name: contact.name || contact.fullName || "",
        phone: contact.phone || "",
        email: contact.email || "",
      })) ?? [],
    branches:
      cooperative.branches?.map((branch): Branch => ({
        id: branch.id,
        contactId: branch.contacts?.[0]?.id,
        name: branch.name || "",
        taxCode: branch.taxCode || "",
        phone: branch.contacts?.[0]?.phone || "",
        taxAddress: branch.taxAddress || "",
        email: branch.contacts?.[0]?.email || "",
        address: branch.address || "",
        note: branch.metadataJson?.note ? String(branch.metadataJson.note) : "",
      })) ?? [],
    bankAccounts:
      cooperative.bankAccounts?.map((account): BankAccount => ({
        id: account.id,
        bankId: account.bank?.id,
        bankName: account.bank?.shortName || account.bank?.name || "",
        accountHolder: account.accountHolder || "",
        accountNumber: account.accountNumber || "",
        branch: account.branch || "",
        note: account.note || "",
        bin: account.bank?.bin || "",
        logo: account.bank?.logoUrl || "",
      })) ?? [],
    documents:
      cooperative.documents?.map((doc) => ({
        id: doc.id,
        name: doc.name || "",
        type: doc.mimeType || doc.documentType || "",
        size: toTextSize(doc.sizeBytes, ""),
        url: doc.fileUrl || "",
        fileName: doc.fileName || doc.name || "",
        fileUrl: doc.fileUrl || "",
        mimeType: doc.mimeType || doc.documentType || "",
        sizeBytes: doc.sizeBytes,
      })) ?? [],
  };
};
