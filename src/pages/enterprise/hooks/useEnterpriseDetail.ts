import { useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";

import { useOrganizationById } from "@/features/organization";
import { useSelectedWorkspaceId } from "@/features/workspace";
import type { OrganizationRecord } from "@/features/organization";
import type { Enterprise } from "../data/constants";

const mapOrganizationToEnterprise = (
  organization: OrganizationRecord,
): Enterprise => {
  const primaryContact =
    organization.contacts?.find((contact) => contact.isPrimary) ??
    organization.contacts?.[0] ??
    null;

  return {
    id: Number(organization.id),
    code: organization.code || "",
    name: organization.name || "",
    image: organization.imageUrl || "",
    type:
      organization.type === "enterprise" ||
      organization.type === "cooperative" ||
      organization.type === "farm"
        ? organization.type
        : "enterprise",
    classification:
      organization.businessLines
        ?.map((line) => line.code || line.name)
        .filter((item): item is string => Boolean(item)) ?? [],
    taxCode: organization.taxCode || "",
    address: organization.address || "",
    phone: primaryContact?.phone || "",
    email: primaryContact?.email || "",
    status: organization.status === "inactive" ? "inactive" : "active",
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
        id: contact.id,
        name: contact.name || contact.fullName || "",
        phone: contact.phone || "",
        email: contact.email || "",
      })) ?? [],
    branches:
      organization.branches?.map((branch) => ({
        id: branch.id,
        name: branch.name || "",
        taxCode: branch.taxCode || "",
        contactId: branch.contacts?.[0]?.id,
        phone: branch.contacts?.[0]?.phone || "",
        taxAddress: branch.taxAddress || "",
        email: branch.contacts?.[0]?.email || "",
        address: branch.address || "",
        note: branch.metadataJson?.note ? String(branch.metadataJson.note) : "",
      })) ?? [],
    bankAccounts:
      organization.bankAccounts?.map((account) => ({
        id: account.id,
        bankName: account.bank?.shortName || account.bank?.name || "",
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
        date: doc.createdAt || doc.updatedAt || "",
      })) ?? [],
  };
};

export function useEnterpriseDetail() {
  const [, params] = useRoute("/enterprise/:id");
  const [, setLocation] = useLocation();
  const workspaceId = useSelectedWorkspaceId();

  const enterpriseId = params?.id ? Number(params.id) : null;
  const isValidId = enterpriseId !== null && Number.isFinite(enterpriseId);

  const organizationQuery = useOrganizationById(
    enterpriseId ?? "missing",
    workspaceId ?? "missing",
    {
      enabled: workspaceId !== null && isValidId,
    },
  );

  const data = useMemo(
    () =>
      organizationQuery.item
        ? mapOrganizationToEnterprise(organizationQuery.item)
        : null,
    [organizationQuery.item],
  );
  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const [branchSearchQuery, setBranchSearchQuery] = useState("");

  return {
    data,
    loading: organizationQuery.loading,
    error: organizationQuery.error,
    setLocation,
    bankSearchQuery,
    setBankSearchQuery,
    branchSearchQuery,
    setBranchSearchQuery,
  };
}
