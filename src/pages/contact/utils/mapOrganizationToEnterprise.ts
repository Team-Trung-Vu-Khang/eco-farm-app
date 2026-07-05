import type { OrganizationRecord } from "@/features/organization";
import type { Enterprise } from "@/pages/enterprise/data/constants";

const normalizeStatus = (
  status: OrganizationRecord["status"],
): Enterprise["status"] => (status === "inactive" ? "inactive" : "active");

const toClassificationValue = (
  line: { code?: string; name?: string } | null | undefined,
): Enterprise["classification"][number] | null => {
  const raw = `${line?.code || ""} ${line?.name || ""}`.toLowerCase();

  if (
    raw.includes("production") ||
    raw.includes("sản xuất") ||
    raw.includes("sx")
  ) {
    return "production";
  }

  if (
    raw.includes("processing") ||
    raw.includes("chế biến") ||
    raw.includes("cb")
  ) {
    return "processing";
  }

  if (
    raw.includes("trading") ||
    raw.includes("thương mại") ||
    raw.includes("tm")
  ) {
    return "trading";
  }

  if (
    raw.includes("service") ||
    raw.includes("dịch vụ") ||
    raw.includes("dv")
  ) {
    return "service";
  }

  return null;
};

export const mapOrganizationToEnterprise = (
  organization: OrganizationRecord,
): Enterprise => {
  const primaryContact =
    organization.contacts?.find((contact) => contact.isPrimary) ??
    organization.contacts?.[0] ??
    null;

  const classification = Array.from(
    new Set(
      (organization.businessLines ?? [])
        .map((line) => toClassificationValue(line))
        .filter(
          (item): item is Enterprise["classification"][number] => item !== null,
        ),
    ),
  );

  return {
    id: Number(organization.id),
    code: organization.code || "",
    name: organization.name || "",
    image: organization.imageUrl || undefined,
    type:
      organization.type === "farm" || organization.type === "cooperative"
        ? organization.type
        : "enterprise",
    classification,
    taxCode: organization.taxCode || "",
    address: organization.address || "",
    phone: primaryContact?.phone || "",
    email: primaryContact?.email || "",
    status: normalizeStatus(organization.status),
    createdAt: organization.createdAt || "",
    brandName: organization.brandName || "",
    representative: organization.representative || "",
    foundedDate: organization.foundedDate || "",
    website: organization.website || "",
    province: organization.province || "",
    district: organization.district || "",
    ward: organization.ward || "",
    latitude: organization.latitude,
    longitude: organization.longitude,
    taxAddress: organization.taxAddress || "",
    taxAuthority: organization.taxAuthority || "",
    issueDate: organization.issueDate || "",
    description: organization.description || "",
    contacts:
      organization.contacts?.map((contact) => ({
        name: contact.name || contact.fullName || "",
        phone: contact.phone || "",
        email: contact.email || "",
      })) ?? [],
    branches:
      organization.branches?.map((branch) => ({
        name: branch.name || "",
        taxCode: branch.taxCode || "",
        phone: branch.contacts?.[0]?.phone || "",
        taxAddress: branch.taxAddress || "",
        email: branch.contacts?.[0]?.email || "",
        address: branch.address || "",
        note: branch.metadataJson?.note ? String(branch.metadataJson.note) : "",
      })) ?? [],
    bankAccounts:
      organization.bankAccounts?.map((account) => ({
        bankName: account.bank?.name || "",
        accountHolder: account.accountHolder || "",
        accountNumber: account.accountNumber || "",
        branch: account.branch || "",
        note: account.note || "",
        bin: account.bank?.bin || "",
        logo: account.bank?.logoUrl || "",
      })) ?? [],
    documents:
      organization.documents?.map((doc) => ({
        name: doc.name || "",
        type: doc.mimeType || doc.documentType || "",
        size: doc.sizeBytes
          ? `${(doc.sizeBytes / (1024 * 1024)).toFixed(2)} MB`
          : "",
        url: doc.fileUrl || "",
        date: doc.createdAt,
      })) ?? [],
  };
};
