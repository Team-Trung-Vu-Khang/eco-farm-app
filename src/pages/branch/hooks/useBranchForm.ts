import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useBranchStore from "@/stores/useBranchStore";
import useEnterpriseStore from "@/stores/useEnterpriseStore";
import { emptyBranchFormData } from "../data/constants";
import { buildBranchFullAddress } from "../utils/form";
import type { BranchFormData, ContactInfo } from "../types/types";
import type { Enterprise } from "@/pages/enterprise/data/constants";

function getInitialBranchFormData(
  branch?: ReturnType<typeof useBranchStore.getState>["branches"][number],
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

  const contactInfos: ContactInfo[] = [];
  if (branch.phone || branch.email) {
    contactInfos.push({
      id: "1",
      phone: branch.phone || "",
      email: branch.email || "",
      isPrimary: true,
    });
  }

  return {
    code: branch.code,
    name: branch.name,
    enterpriseId,
    enterpriseName: enterpriseName || branch.enterpriseName,
    taxCode: branch.taxCode || "",
    taxAddress: branch.taxAddress || "",
    address: branch.address,
    city: branch.city || "",
    district: branch.district || "",
    ward: branch.ward || "",
    imageUrl: branch.imageUrl || "",
    latitude: branch.latitude ? parseFloat(branch.latitude) : 10.7769,
    longitude: branch.longitude ? parseFloat(branch.longitude) : 106.7009,
    status: branch.status,
    website: branch.website || "",
    contactInfos,
    contacts: branch.contacts || [],
    bankAccounts: branch.bankAccounts || [],
  };
}

export function useBranchForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/branch/:id/edit");
  const isEdit = !!params?.id;
  const branchId = params?.id ? parseInt(params.id) : undefined;

  const getBranchById = useBranchStore((state) => state.getBranchById);
  const addBranch = useBranchStore((state) => state.addBranch);
  const updateBranch = useBranchStore((state) => state.updateBranch);
  const branches = useBranchStore((state) => state.branches);
  const branch = branchId ? getBranchById(branchId) : undefined;

  const enterprisesFromStore = useEnterpriseStore((state) => state.enterprises);
  const enterprises: Enterprise[] = enterprisesFromStore
    .filter((e) => e.type === "enterprise")
    .sort((a, b) => a.name.localeCompare(b.name));

  const initialEnterprise =
    (branch?.enterpriseName
      ? enterprises.find((enterprise) => enterprise.name === branch.enterpriseName)
      : undefined) || (enterprises.length === 1 ? enterprises[0] : undefined);

  const initialEnterpriseId = initialEnterprise?.id.toString() || "";
  const initialEnterpriseName = initialEnterprise?.name || "";

  const [formData, setFormData] = useState<BranchFormData>(() =>
    getInitialBranchFormData(
      branch,
      initialEnterpriseId,
      initialEnterpriseName,
    ),
  );

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const updateFormData = (updates: Partial<BranchFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleComplete = () => {
    setShowConfirmDialog(true);
  };

  const submitForm = () => {
    setShowConfirmDialog(false);
    const fullAddress = buildBranchFullAddress({
      address: formData.address,
      ward: formData.ward,
      district: formData.district,
      city: formData.city,
    });
    const primaryContactInfo =
      formData.contactInfos.find((contactInfo) => contactInfo.isPrimary) ||
      formData.contactInfos[0];

    const branchPayload = {
      code: formData.code,
      name: formData.name,
      enterpriseName: formData.enterpriseName,
      taxCode: formData.taxCode,
      taxAddress: formData.taxAddress,
      website: formData.website,
      phone: primaryContactInfo?.phone || "",
      email: primaryContactInfo?.email || "",
      address: fullAddress || formData.address,
      city: formData.city,
      district: formData.district,
      ward: formData.ward,
      imageUrl: formData.imageUrl,
      latitude: formData.latitude.toString(),
      longitude: formData.longitude.toString(),
      status: formData.status,
      contacts: formData.contacts,
      bankAccounts: formData.bankAccounts,
    };

    if (isEdit && branchId) {
      updateBranch(branchId, branchPayload);
      toast({ title: "Thành công", description: `Đã cập nhật chi nhánh "${formData.name}"` });
    } else {
      const newId = branches.length > 0 ? Math.max(...branches.map((b) => b.id)) + 1 : 1;
      addBranch({
        ...branchPayload,
        id: newId,
        code: formData.code || `CN${String(newId).padStart(3, "0")}`,
        createdAt: new Date().toISOString(),
      });
      toast({ title: "Thành công", description: `Đã thêm chi nhánh mới "${formData.name}"` });
    }
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
    handleCancel: () => setLocation("/branch"),
  };
}
