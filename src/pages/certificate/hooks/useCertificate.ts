import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  useCreateMasterData,
  useDeleteMasterData,
  useMasterData,
  useUpdateMasterData,
  type CertificateIssuerCreateRequest,
} from "@/features/master-data";
import {
  emptyStandardFormData,
  initialStandards,
} from "../data/constants";
import type {
  CategoryType,
  Certificate,
  CertificationOrganization,
  OrganizationFormData,
  StandardFormData,
} from "../types/types";

function buildOrganizationPayload(formData: OrganizationFormData) {
  return {
    code: formData.code.trim().toUpperCase(),
    name: formData.name.trim(),
    address: formData.address.trim(),
    phone: formData.phone.trim(),
    email: formData.email.trim(),
    website: formData.website.trim(),
    description: formData.description?.trim() || undefined,
    status: formData.status,
  };
}

export function useCertificate() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<CategoryType>("standards");
  const [organizationSearchQuery, setOrganizationSearchQuery] = useState("");
  const [organizationStatusFilter, setOrganizationStatusFilter] =
    useState("all");

  const organizationsQuery = useMasterData("certificate-issuers", {
    params: {
      keyword: organizationSearchQuery.trim() || undefined,
      status:
        organizationStatusFilter === "all"
          ? undefined
          : organizationStatusFilter,
      page: 0,
      size: 100,
    },
  });

  const createOrganization = useCreateMasterData("certificate-issuers");
  const updateOrganization = useUpdateMasterData("certificate-issuers");
  const deleteOrganization = useDeleteMasterData("certificate-issuers");

  const organizations = useMemo<CertificationOrganization[]>(
    () => organizationsQuery.items,
    [organizationsQuery.items],
  );

  const [standards, setStandards] = useState<Certificate[]>(initialStandards);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<
    Certificate | CertificationOrganization | null
  >(null);

  // Form states for Standards
  const [standardFormOpen, setStandardFormOpen] = useState(false);
  const [editStandard, setEditStandard] = useState<Certificate | null>(null);
  const [standardFormData, setStandardFormData] =
    useState<StandardFormData>(emptyStandardFormData);

  // Form states for Organizations
  const [orgFormOpen, setOrgFormOpen] = useState(false);
  const [editOrg, setEditOrg] = useState<CertificationOrganization | null>(
    null,
  );

  const [orgSearchQuery, setOrgSearchQuery] = useState("");

  const handleAddStandard = () => {
    setEditStandard(null);
    setStandardFormData(emptyStandardFormData);
    setOrgSearchQuery("");
    setStandardFormOpen(true);
  };

  const handleEditStandard = (item: Certificate) => {
    setEditStandard(item);
    setStandardFormData({ ...item });
    setOrgSearchQuery("");
    setStandardFormOpen(true);
  };

  const handleSubmitStandard = () => {
    if (editStandard) {
      setStandards((prev) =>
        prev.map((s) =>
          s.id === editStandard.id ? { ...s, ...standardFormData } : s,
        ),
      );
      toast({ title: "Thành công", description: "Đã cập nhật loại tiêu chuẩn" });
    } else {
      const newStandard: Certificate = {
        id: Date.now(),
        ...standardFormData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setStandards((prev) => [...prev, newStandard]);
      toast({ title: "Thành công", description: "Đã thêm loại tiêu chuẩn mới" });
    }
    setStandardFormOpen(false);
  };

  const handleAddOrg = () => {
    setEditOrg(null);
    setOrgFormOpen(true);
  };

  const handleEditOrg = (item: CertificationOrganization) => {
    setEditOrg(item);
    setOrgFormOpen(true);
  };

  const handleSubmitOrg = async (
    formData: OrganizationFormData,
  ): Promise<void> => {
    const payload: CertificateIssuerCreateRequest = buildOrganizationPayload(
      formData,
    );

    try {
      if (editOrg) {
        await updateOrganization.mutateAsync({
          id: editOrg.id,
          data: payload,
        });
        toast({ title: "Thành công", description: "Đã cập nhật tổ chức" });
      } else {
        await createOrganization.mutateAsync(payload);
        toast({ title: "Thành công", description: "Đã thêm tổ chức mới" });
      }

      setOrgFormOpen(false);
      setEditOrg(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";

      toast({
        title: editOrg ? "Không thể cập nhật" : "Không thể thêm",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = (item: Certificate | CertificationOrganization) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) {
      setDeleteOpen(false);
      return;
    }

    try {
      if (activeTab === "standards") {
        setStandards((prev) => prev.filter((s) => s.id !== deleteItem.id));
        toast({ title: "Thành công", description: "Đã xóa loại tiêu chuẩn" });
      } else {
        await deleteOrganization.mutateAsync(deleteItem.id);
        toast({ title: "Thành công", description: "Đã xóa tổ chức" });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";

      toast({
        title: "Không thể xóa",
        description: message,
        variant: "destructive",
      });
    }

    setDeleteOpen(false);
  };

  return {
    activeTab,
    setActiveTab,
    standards,
    organizations,
    organizationSearchQuery,
    setOrganizationSearchQuery,
    organizationStatusFilter,
    setOrganizationStatusFilter,
    organizationsLoading: organizationsQuery.loading,
    organizationsError: organizationsQuery.error,
    standardFormOpen,
    setStandardFormOpen,
    orgFormOpen,
    setOrgFormOpen,
    standardFormData,
    setStandardFormData,
    editStandard,
    editOrg,
    orgSearchQuery,
    setOrgSearchQuery,
    deleteOpen,
    setDeleteOpen,
    handleAddStandard,
    handleEditStandard,
    handleSubmitStandard,
    handleAddOrg,
    handleEditOrg,
    handleSubmitOrg,
    handleDelete,
    handleConfirmDelete,
    organizationsPending:
      createOrganization.isPending ||
      updateOrganization.isPending ||
      deleteOrganization.isPending,
  };
}
