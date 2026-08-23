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
import { CLASSIFICATION_OPTIONS } from "../data/constants";

const CLASSIFICATION_TO_BUSINESS_LINE_META: Record<
  string,
  { code: string; label: string }
> = {
  production: { code: "SX", label: "Sản xuất" },
  processing: { code: "CB", label: "Chế biến" },
  trading: { code: "TM", label: "Thương mại" },
  service: { code: "DV", label: "Dịch vụ" },
  other: { code: "KHAC", label: "Khác" },
};

const BUSINESS_LINE_TO_CLASSIFICATION: Record<string, string> = {
  SX: "production",
  CB: "processing",
  TM: "trading",
  DV: "service",
  KHAC: "other",
};

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

const normalizeText = (value?: string | null) =>
  (value || "").trim().toLowerCase();

export const mapOrganizationBusinessLinesToClassification = (
  businessLines: OrganizationRecord["businessLines"] | undefined,
) =>
  (businessLines ?? [])
    .map((line) => {
      const normalizedCode = normalizeText(line.code);
      const normalizedName = normalizeText(line.name);

      if (normalizedCode.toUpperCase() in BUSINESS_LINE_TO_CLASSIFICATION) {
        return BUSINESS_LINE_TO_CLASSIFICATION[
          normalizedCode.toUpperCase()
        ] as Enterprise["classification"][number];
      }

      const optionByValue = CLASSIFICATION_OPTIONS.find(
        (option) =>
          normalizeText(option.value) === normalizedCode ||
          normalizeText(option.value) === normalizedName,
      );
      if (optionByValue) return optionByValue.value;

      const optionByLabel = CLASSIFICATION_OPTIONS.find(
        (option) =>
          normalizeText(option.label) === normalizedName ||
          normalizeText(option.label) === normalizedCode,
      );
      if (optionByLabel) return optionByLabel.value;

      return undefined;
    })
    .filter(Boolean) as Enterprise["classification"];

export const mapClassificationToBusinessLines = (
  classifications: string[],
  businessLineRecords: OrganizationRecord["businessLines"] | undefined,
) =>
  classifications
    .map((classification) => {
      const meta = CLASSIFICATION_TO_BUSINESS_LINE_META[classification] ?? {
        code: classification,
        label: classification,
      };

      return businessLineRecords?.find(
        (item) =>
          normalizeText(item.code) === normalizeText(meta.code) ||
          normalizeText(item.name) === normalizeText(meta.label) ||
          normalizeText(item.code) === normalizeText(classification) ||
          normalizeText(item.name) === normalizeText(classification),
      );
    })
    .filter(
      (item): item is NonNullable<typeof item> => Boolean(item),
    );

export const classificationLabel = (value: string) =>
  CLASSIFICATION_OPTIONS.find((option) => option.value === value)?.label ?? value;

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
      mapOrganizationBusinessLinesToClassification(cooperative.businessLines)
        .map(classificationLabel)
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
