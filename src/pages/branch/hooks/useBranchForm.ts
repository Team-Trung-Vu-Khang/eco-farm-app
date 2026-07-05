import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useRoute } from "wouter";
import {
  useBranchById,
  useCreateBranch,
  useUpdateBranch,
  type BranchCreateRequest,
  type BranchUpdateRequest,
} from "@/features/branch";
import {
  useOrganizations,
  type OrganizationRecord,
} from "@/features/organization";
import { useSelectedWorkspaceId } from "@/features/workspace";
import {
  branchFormSchema,
  buildBranchPayload,
  createBranchFormValues,
  type BranchFormInput,
  type BranchFormValues,
} from "../data/branch-form.schema";
import type { Enterprise } from "@/pages/enterprise/data/constants";
import type {
  BranchBankAccount,
  BranchFormData,
  ContactInfo,
  ContactPerson,
} from "../types/types";

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
  contact?: BranchFormValues["contacts"][number],
  fallbackId = "1",
): ContactInfo | null {
  if (!contact) return null;

  const name = contact.name || "";
  const phone = contact.phone || "";
  const email = contact.email || "";

  if (!name && !phone && !email) return null;

  return {
    id: String(contact.contactId ?? fallbackId),
    contactId: contact.contactId ? String(contact.contactId) : undefined,
    name,
    phone,
    email,
    isPrimary: Boolean(contact.isPrimary),
  };
}

function mapBranchContactToContactPerson(
  contact?: BranchFormValues["contacts"][number],
  fallbackId = "1",
): ContactPerson | null {
  if (!contact) return null;

  const name = contact.name || "";
  if (!name && !contact.phone && !contact.email) return null;

  return {
    id: String(contact.contactId ?? fallbackId),
    contactId: contact.contactId ? String(contact.contactId) : undefined,
    name,
    position: contact.position || "",
    phone: contact.phone || "",
    email: contact.email || "",
    isPrimary: Boolean(contact.isPrimary),
  };
}

function mapBranchBankToBankAccount(
  bankAccount?: BranchFormValues["bankAccounts"][number],
): BranchBankAccount | null {
  if (!bankAccount) return null;

  const bankName = bankAccount.bankName || bankAccount.bankCode || "";

  if (!bankName && !bankAccount.accountNumber && !bankAccount.accountHolder) {
    return null;
  }

  return {
    id: String(bankAccount.id ?? ""),
    bankAccountId: bankAccount.bankAccountId,
    bankId: bankAccount.bankId,
    bankCode: bankAccount.bankCode || "",
    bankName,
    accountNumber: bankAccount.accountNumber || "",
    accountHolder: bankAccount.accountHolder || "",
    branch: bankAccount.branch || "",
    note: bankAccount.note || "",
    bin: bankAccount.bin || "",
    logo: bankAccount.logoUrl || "",
    isPrimary: Boolean(bankAccount.isPrimary),
  };
}

function normalizeBranchFormData(
  values: BranchFormValues,
  enterprises: Enterprise[],
): BranchFormData {
  const selectedEnterprise = enterprises.find(
    (enterprise) => enterprise.id.toString() === values.organizationId,
  );

  const contactInfos = (values.contacts || [])
    .map((contact, index) =>
      mapBranchContactToContactInfo(contact, String(index + 1)),
    )
    .filter((item): item is ContactInfo => Boolean(item));

  const contacts = (values.contacts || [])
    .map((contact, index) =>
      mapBranchContactToContactPerson(contact, String(index + 1)),
    )
    .filter((item): item is ContactPerson => Boolean(item));

  const bankAccounts = (values.bankAccounts || [])
    .map(mapBranchBankToBankAccount)
    .filter((item): item is BranchBankAccount => Boolean(item));

  return {
    code: values.code,
    name: values.name,
    enterpriseId: values.organizationId,
    enterpriseName: selectedEnterprise?.name || "",
    taxCode: values.taxCode,
    taxAddress: values.taxAddress,
    website: values.website,
    address: values.address,
    city: values.city,
    district: values.district,
    ward: values.ward,
    imageUrl: values.imageUrl,
    latitude: values.latitude,
    longitude: values.longitude,
    status: values.status === "active" ? "active" : "inactive",
    contactInfos,
    contacts,
    bankAccounts,
  };
}

function toBankFormValues(
  bankAccounts: BranchFormData["bankAccounts"],
): BranchFormValues["bankAccounts"] {
  return bankAccounts.map((bankAccount) => {
    return {
      id: bankAccount.id,
      bankAccountId: bankAccount.bankAccountId,
      bankId: bankAccount.bankId,
      bankCode: bankAccount.bankCode || bankAccount.bankName,
      ownerType: "",
      ownerId: undefined,
      bankName: bankAccount.bankName,
      bin: bankAccount.bin || "",
      accountNumber: bankAccount.accountNumber,
      accountHolder: bankAccount.accountHolder,
      branch: bankAccount.branch,
      note: bankAccount.note || "",
      logoUrl: bankAccount.logo || "",
      status: "active",
      isPrimary: bankAccount.isPrimary,
      metadataJson: null,
    };
  });
}

function toContactFormValues(
  contacts: BranchFormData["contactInfos"],
): BranchFormValues["contacts"] {
  return contacts.map((contact) => ({
    contactId: contact.contactId,
    name: contact.name || "",
    position: "",
    phone: contact.phone,
    email: contact.email,
    isPrimary: contact.isPrimary,
  }));
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

  const defaultValues = useMemo(
    () => createBranchFormValues(branchQuery.item),
    [branchQuery.item],
  );

  const form = useForm<BranchFormInput, unknown, BranchFormValues>({
    defaultValues,
    resolver: zodResolver(branchFormSchema),
    mode: "onChange",
  });

  const { getValues, setValue, reset, clearErrors, trigger } = form;
  const formValues = useWatch({ control: form.control });
  const formData = useMemo(
    () => normalizeBranchFormData(formValues, enterprises),
    [enterprises, formValues],
  );

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
      clearErrors();
    }
  }, [clearErrors, defaultValues, reset]);

  const updateFormData = (updates: Partial<BranchFormData>) => {
    if (updates.enterpriseId !== undefined) {
      setValue("organizationId", updates.enterpriseId, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    if (updates.code !== undefined) {
      setValue("code", updates.code, { shouldDirty: true, shouldTouch: true });
    }

    if (updates.name !== undefined) {
      setValue("name", updates.name, { shouldDirty: true, shouldTouch: true });
    }

    if (updates.taxCode !== undefined) {
      setValue("taxCode", updates.taxCode, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    if (updates.taxAddress !== undefined) {
      setValue("taxAddress", updates.taxAddress, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    if (updates.website !== undefined) {
      setValue("website", updates.website, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    if (updates.address !== undefined) {
      setValue("address", updates.address, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    if (updates.city !== undefined) {
      setValue("city", updates.city, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    if (updates.district !== undefined) {
      setValue("district", updates.district, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    if (updates.ward !== undefined) {
      setValue("ward", updates.ward, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    if (updates.imageUrl !== undefined) {
      setValue("imageUrl", updates.imageUrl, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    if (updates.latitude !== undefined) {
      setValue("latitude", updates.latitude, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    if (updates.longitude !== undefined) {
      setValue("longitude", updates.longitude, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    if (updates.status !== undefined) {
      setValue("status", updates.status, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    if (updates.contactInfos !== undefined) {
      setValue("contacts", toContactFormValues(updates.contactInfos), {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    if (updates.contacts !== undefined) {
      setValue(
        "contacts",
        updates.contacts.map((contact) => ({
          contactId: contact.contactId,
          name: contact.name,
          position: contact.position,
          phone: contact.phone,
          email: contact.email,
          isPrimary: contact.isPrimary,
        })),
        {
          shouldDirty: true,
          shouldTouch: true,
        },
      );
    }

    if (updates.bankAccounts !== undefined) {
      setValue("bankAccounts", toBankFormValues(updates.bankAccounts), {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    if (updates.metadataJson !== undefined) {
      setValue("metadataJson", updates.metadataJson, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const handleComplete = async () => {
    const isValid = await trigger();
    if (!isValid) return;
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

    const payload = buildBranchPayload(getValues() as BranchFormValues, branchId);

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
    form,
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
