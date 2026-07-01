import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";

import { vietQrBankData } from "@/constants/banks";
import {
  useBranchById,
  useCreateBranch,
  useUpdateBranch,
  type BranchBankRecord,
  type BranchBankRequest,
  type BranchContactRecord,
  type BranchContactRequest,
  type BranchCreateRequest,
  type BranchRecord,
  type BranchUpdateRequest,
} from "@/features/branch";
import {
  useOrganizations,
  type OrganizationRecord,
} from "@/features/organization";
import { useSelectedWorkspaceId } from "@/features/workspace";
import type { Enterprise } from "@/pages/enterprise/data/constants";
import { emptyBranchFormData } from "../data/constants";
import type {
  BranchBankAccount,
  BranchFormData,
  ContactInfo,
  ContactPerson,
} from "../types/types";
import { buildBranchFullAddress } from "../utils/form";

const DEFAULT_LATITUDE = 10.7769;
const DEFAULT_LONGITUDE = 106.7009;

function toNumber(value: string | number | undefined | null) {
  if (value === undefined || value === null || value === "") return undefined;
  const next = Number(value);
  return Number.isFinite(next) ? next : undefined;
}

function mapOrganizationToEnterprise(
  organization: OrganizationRecord,
): Enterprise {
  return {
    id: Number(organization.id),
    code: organization.code,
    name: organization.name,
    image: organization.imageUrl || undefined,
    type: "enterprise",
    classification: ["other"],
    taxCode: organization.taxCode || "",
    address: organization.address || "",
    phone: organization.contacts?.[0]?.phone || "",
    email: organization.contacts?.[0]?.email || "",
    status: organization.status === "inactive" ? "inactive" : "active",
    createdAt: organization.createdAt || new Date().toISOString(),
    brandName: organization.brandName,
    representative: organization.representative,
    foundedDate: organization.foundedDate,
    website: organization.website,
    province: organization.province,
    district: organization.district,
    ward: organization.ward,
    latitude: organization.latitude,
    longitude: organization.longitude,
    taxAddress: organization.taxAddress,
    taxAuthority: organization.taxAuthority,
    issueDate: organization.issueDate,
    description: organization.description,
    contacts: [],
    branches: [],
    bankAccounts: [],
    documents: [],
  };
}

function mapBranchContactToContactInfo(
  contact?: BranchContactRecord | null,
  fallbackId = "1",
): ContactInfo | null {
  if (!contact) return null;

  const name = contact.fullName || contact.name || "";
  const phone = contact.phone || "";
  const email = contact.email || "";

  if (!name && !phone && !email) return null;

  return {
    id: String(contact.id ?? fallbackId),
    name,
    phone,
    email,
    isPrimary: Boolean(contact.isPrimary),
  };
}

function mapBranchContactToContactPerson(
  contact: BranchContactRecord,
): ContactPerson | null {
  const name = contact.fullName || contact.name || "";
  if (!name && !contact.phone && !contact.email) return null;

  return {
    id: String(contact.id),
    name,
    position: contact.position || "",
    phone: contact.phone || "",
    email: contact.email || "",
    isPrimary: Boolean(contact.isPrimary),
  };
}

function mapBranchBankToBankAccount(
  bankAccount: BranchBankRecord,
): BranchBankAccount | null {
  const bankName =
    bankAccount.bank?.shortName ||
    bankAccount.bank?.name ||
    (bankAccount as { bankCode?: string }).bankCode ||
    "";

  if (!bankName && !bankAccount.accountNumber && !bankAccount.accountHolder) {
    return null;
  }

  return {
    id: String(bankAccount.id),
    bankName,
    accountNumber: bankAccount.accountNumber || "",
    accountHolder: bankAccount.accountHolder || "",
    branch: bankAccount.branch || "",
    note: bankAccount.note || "",
    bin: bankAccount.bank?.bin || "",
    logo: bankAccount.bank?.logoUrl || "",
    isPrimary: Boolean(bankAccount.isPrimary),
  };
}

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

function getInitialBranchFormData(
  branch?: BranchRecord | null,
  enterpriseId = "",
  enterpriseName = "",
): BranchFormData {
  if (!branch) {
    return {
      ...emptyBranchFormData,
      enterpriseId,
      enterpriseName,
    };
  }

  const primaryContact =
    branch.contacts?.find((contact) => contact.isPrimary) ??
    branch.contacts?.[0];
  const contactInfos: ContactInfo[] = [];
  const primaryContactInfo = mapBranchContactToContactInfo(primaryContact, "1");
  if (primaryContactInfo) {
    contactInfos.push(primaryContactInfo);
  }

  const contacts = (branch.contacts || [])
    .map(mapBranchContactToContactPerson)
    .filter((item): item is ContactPerson => Boolean(item));

  const bankAccounts = (branch.bankAccounts || [])
    .map(mapBranchBankToBankAccount)
    .filter((item): item is BranchBankAccount => Boolean(item));

  return {
    code: branch.code || "",
    name: branch.name || "",
    enterpriseId,
    enterpriseName: enterpriseName || branch.organization?.name || "",
    taxCode: branch.taxCode || "",
    taxAddress: branch.taxAddress || "",
    website: branch.website || "",
    address: branch.address || "",
    city: branch.city || "",
    district: branch.district || "",
    ward: branch.ward || "",
    imageUrl: branch.imageUrl || "",
    latitude: branch.latitude ?? DEFAULT_LATITUDE,
    longitude: branch.longitude ?? DEFAULT_LONGITUDE,
    status: branch.status === "inactive" ? "inactive" : "active",
    contactInfos,
    contacts,
    bankAccounts,
  };
}

function mapFormDataToBranchPayload(
  formData: BranchFormData,
  branchId?: number,
): BranchCreateRequest | BranchUpdateRequest {
  const primaryContactPerson =
    formData.contacts.find((contact) => contact.isPrimary) ||
    formData.contacts[0];

  const contactInfosAsContacts: BranchContactRequest[] =
    formData.contactInfos.map((contact) => ({
      name: contact.name || primaryContactPerson?.name || "Liên hệ",
      position: primaryContactPerson?.position || "",
      phone: contact.phone || "",
      email: contact.email || "",
      isPrimary: contact.isPrimary,
    }));

  const personnelContacts: BranchContactRequest[] = formData.contacts.map(
    (contact) => ({
      contactId: toNumber(contact.id) ?? contact.id,
      name: contact.name || "",
      position: contact.position || "",
      phone: contact.phone || "",
      email: contact.email || "",
      isPrimary: contact.isPrimary,
    }),
  );

  const combinedContacts: BranchContactRequest[] = ensurePrimaryContact(
    dedupeContacts([...contactInfosAsContacts, ...personnelContacts]),
  );

  const bankAccounts: BranchBankRequest[] = ensurePrimaryContact(
    formData.bankAccounts.map((bankAccount): BranchBankRequest => {
      const bankInfo = vietQrBankData.find(
        (bank) =>
          bank.shortName === bankAccount.bankName ||
          bank.name === bankAccount.bankName,
      );

      return {
        bankCode: bankInfo?.code || bankAccount.bankName,
        bankName: bankInfo?.shortName || bankInfo?.name || bankAccount.bankName,
        bin: bankAccount.bin || bankInfo?.bin || "",
        accountNumber: bankAccount.accountNumber,
        accountHolder: bankAccount.accountHolder,
        branch: bankAccount.branch,
        note: bankAccount.note,
        logoUrl: bankAccount.logo || bankInfo?.logo || "",
        status: "active" as const,
        isPrimary: bankAccount.isPrimary,
      };
    }),
  );

  const address = buildBranchFullAddress({
    address: formData.address,
    ward: formData.ward,
    district: formData.district,
    city: formData.city,
  });

  return {
    ...(branchId ? { id: branchId } : {}),
    organizationId: toNumber(formData.enterpriseId) ?? formData.enterpriseId,
    code: formData.code,
    name: formData.name,
    taxCode: formData.taxCode,
    taxAddress: formData.taxAddress,
    website: formData.website,
    address: address || formData.address,
    city: formData.city,
    district: formData.district,
    ward: formData.ward,
    imageUrl: formData.imageUrl,
    latitude: formData.latitude,
    longitude: formData.longitude,
    status: formData.status,
    contacts: combinedContacts,
    bankAccounts,
    metadataJson: null,
  };
}

export type { BranchFormData } from "../types/types";

export function useBranchForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/branch/:id/edit");
  const workspaceId = useSelectedWorkspaceId();

  const isEdit = Boolean(params?.id);
  const branchId = params?.id ? Number(params.id) : undefined;

  const branchQuery = useBranchById(
    branchId ?? "missing",
    workspaceId ?? "missing",
    {
      enabled: isEdit && branchId !== undefined && workspaceId !== null,
    },
  );

  const organizationsQuery = useOrganizations(
    {
      type: "enterprise",
      page: 0,
      size: 10,
    },
    workspaceId ?? "missing",
    {
      enabled: workspaceId !== null,
    },
  );

  const createBranchMutation = useCreateBranch({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã thêm chi nhánh mới",
      });
      setLocation("/branch");
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateBranchMutation = useUpdateBranch({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã cập nhật chi nhánh",
      });
      setLocation("/branch");
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const enterprises = useMemo<Enterprise[]>(
    () =>
      organizationsQuery.items
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(mapOrganizationToEnterprise),
    [organizationsQuery.items],
  );

  const [formData, setFormData] = useState<BranchFormData>(() =>
    getInitialBranchFormData(
      branchQuery.item,
      branchQuery.item?.organization?.id
        ? String(branchQuery.item.organization.id)
        : "",
      branchQuery.item?.organization?.name || "",
    ),
  );

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (isEdit && branchQuery.item) {
      const nextEnterpriseId = branchQuery.item.organization?.id
        ? String(branchQuery.item.organization.id)
        : branchQuery.item.organizationId
          ? String(branchQuery.item.organizationId)
          : "";

      // Sync the API payload into the local draft when edit data arrives.
      // This keeps the existing stepper UI intact while still allowing async loading.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(
        getInitialBranchFormData(
          branchQuery.item,
          nextEnterpriseId,
          branchQuery.item.organization?.name || "",
        ),
      );
    }

    if (!isEdit) {
      setFormData(getInitialBranchFormData(undefined));
    }
  }, [branchQuery.item, isEdit]);

  const updateFormData = (updates: Partial<BranchFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleComplete = () => {
    setShowConfirmDialog(true);
  };

  const submitForm = async () => {
    if (
      workspaceId === null ||
      workspaceId === undefined ||
      workspaceId === ""
    ) {
      toast({
        title: "Thiếu workspace",
        description: "Vui lòng chọn workspace trước khi lưu chi nhánh.",
        variant: "destructive",
      });
      return;
    }

    const payload = mapFormDataToBranchPayload(formData, branchId);

    try {
      if (isEdit && branchId !== undefined) {
        await updateBranchMutation.updateBranch({
          id: branchId,
          payload: payload as BranchUpdateRequest,
        });
      } else {
        await createBranchMutation.createBranch(payload as BranchCreateRequest);
      }

      setShowConfirmDialog(false);
    } catch {
      // toast is handled by the mutation callbacks
    }
  };

  const handleCancel = () => {
    setLocation("/branch");
  };

  return {
    formData,
    updateFormData,
    enterprises,
    isEdit,
    showConfirmDialog,
    setShowConfirmDialog,
    handleComplete,
    submitForm,
    handleCancel,
    isLoading:
      organizationsQuery.loading ||
      (isEdit && branchQuery.loading && !branchQuery.item),
    error: branchQuery.error || organizationsQuery.error,
    isSaving: createBranchMutation.isPending || updateBranchMutation.isPending,
  };
}
