import { useEffect, useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  type CertificateStandardRecord,
  useCreateMasterData,
  useDeleteMasterData,
  useMasterData,
  useUpdateMasterData,
  type CertificateIssuerCreateRequest,
  type CertificateStandardCreateRequest,
} from "@/features/master-data";
import type { StandardFormValues } from "../data/standard-form.schema";
import type {
  CategoryType,
  Certificate,
  CertificationOrganization,
  OrganizationFormData,
} from "../types/types";
import { useDebounce } from "@/shared/hooks/useDebounce";

function normalizeStatus(
  status: Certificate["status"] | string | null | undefined,
): Certificate["status"] {
  return status === "inactive" ? "inactive" : "active";
}

function mapStandardRecordToItem(
  item: CertificateStandardRecord,
  organizations: CertificationOrganization[],
): Certificate {
  const itemRaw = item as any;
  const organizationIds: number[] =
    itemRaw.issuerIds ??
    (itemRaw.issuers ?? []).map((issuer: any) => issuer.id) ??
    [];

  const matchedOrganizations =
    itemRaw.issuers && itemRaw.issuers.length > 0
      ? itemRaw.issuers
      : organizations.filter((organization) =>
          organizationIds.includes(organization.id),
        );

  return {
    id: item.id,
    code: item.code ?? "",
    name: item.name ?? "",
    organizationIds,
    issuers: matchedOrganizations,
    documents: item.documents ?? [],
    content: item.documents?.[0]?.content ?? "",
    contentType: item.documents?.[0]?.type === "pdf" ? "file" : "editor",
    fileUrl: item.documents?.[0]?.fileUrl ?? "",
    stampUrl: item.stampUrl ?? "",
    stampType: item.stampUrl ? "url" : "file",
    stampFileUrl: "",
    validityMonths: item.validityMonths ?? 0,
    description: item.description ?? "",
    status: normalizeStatus(item.status),
    createdAt: item.createdAt,
  };
}

function buildStandardPayload(
  formData: StandardFormValues,
): CertificateStandardCreateRequest {
  return {
    code: formData.code.trim().toUpperCase(),
    name: formData.name.trim(),
    stampUrl: formData.stampUrl.trim(),
    description: formData.description.trim() || undefined,
    validityMonths: formData.validityMonths,
    issuerIds: formData.organizationIds,
    documents: formData.documents.map((document) => ({
      type: document.type,
      name: document.name.trim(),
      content: document.content?.trim() || "",
      fileUrl: document.fileUrl.trim(),
      fileName: document.fileName.trim(),
    })),
    status: formData.status,
    metadataJson: null,
  };
}

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

  // Standards States
  const [standardsSearchQuery, setStandardsSearchQuery] = useState("");
  const debouncedStandardsSearch = useDebounce(standardsSearchQuery, 500);
  const [standardsStatusFilter, setStandardsStatusFilter] = useState("all");
  const [standardsPageSize, setStandardsPageSize] = useState(10);
  const [standardsCurrentIndex, setStandardsCurrentIndex] = useState(1);

  // Organizations States
  const [organizationSearchQuery, setOrganizationSearchQuery] = useState("");
  const debouncedOrganizationSearch = useDebounce(organizationSearchQuery, 500);
  const [organizationStatusFilter, setOrganizationStatusFilter] =
    useState("all");
  const [organizationPageSize, setOrganizationPageSize] = useState(10);
  const [organizationCurrentIndex, setOrganizationCurrentIndex] = useState(1);

  useEffect(() => {
    setStandardsSearchQuery("");
    setStandardsStatusFilter("all");
    setStandardsCurrentIndex(1);

    setOrganizationSearchQuery("");
    setOrganizationStatusFilter("all");
    setOrganizationCurrentIndex(1);
  }, [activeTab]);

  const organizationsQuery = useMasterData("certificate-issuers", {
    params: {
      keyword: debouncedOrganizationSearch.trim() || undefined,
      status:
        organizationStatusFilter === "all"
          ? undefined
          : organizationStatusFilter,
      page: Math.max(organizationCurrentIndex - 1, 0),
      size: organizationPageSize,
    },
  });

  const createOrganization = useCreateMasterData("certificate-issuers");
  const updateOrganization = useUpdateMasterData("certificate-issuers");
  const deleteOrganization = useDeleteMasterData("certificate-issuers");

  const organizations = useMemo<CertificationOrganization[]>(
    () => organizationsQuery.items,
    [organizationsQuery.items],
  );

  const standardsQuery = useMasterData("certificate-standards", {
    params: {
      keyword: debouncedStandardsSearch.trim() || undefined,
      status:
        standardsStatusFilter === "all" ? undefined : standardsStatusFilter,
      page: Math.max(standardsCurrentIndex - 1, 0),
      size: standardsPageSize,
    },
  });

  const standards = useMemo<Certificate[]>(
    () =>
      standardsQuery.items.map((item) =>
        mapStandardRecordToItem(
          item as CertificateStandardRecord,
          organizations,
        ),
      ),
    [organizations, standardsQuery.items],
  );

  const createStandard = useCreateMasterData("certificate-standards");
  const updateStandard = useUpdateMasterData("certificate-standards");
  const deleteStandard = useDeleteMasterData("certificate-standards");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<
    Certificate | CertificationOrganization | null
  >(null);

  // Form states for Standards
  const [standardFormOpen, setStandardFormOpen] = useState(false);
  const [editStandard, setEditStandard] = useState<Certificate | null>(null);

  // Form states for Organizations
  const [orgFormOpen, setOrgFormOpen] = useState(false);
  const [editOrg, setEditOrg] = useState<CertificationOrganization | null>(
    null,
  );

  const [orgSearchQuery, setOrgSearchQuery] = useState("");

  const handleAddStandard = () => {
    setEditStandard(null);
    setStandardFormOpen(true);
  };

  const handleEditStandard = (item: Certificate) => {
    setEditStandard(item);
    setStandardFormOpen(true);
  };

  const handleSubmitStandard = async (formData: StandardFormValues) => {
    if (editStandard) {
      const payload = buildStandardPayload(formData);

      try {
        await updateStandard.mutateAsync({
          id: editStandard.id,
          data: payload,
        });
        toast({
          title: "Thành công",
          description: "Đã cập nhật loại tiêu chuẩn",
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi không xác định";

        toast({
          title: "Không thể cập nhật",
          description: message,
          variant: "destructive",
        });
        return;
      }
    } else {
      const payload = buildStandardPayload(formData);

      try {
        await createStandard.mutateAsync(payload);
        toast({
          title: "Thành công",
          description: "Đã thêm loại tiêu chuẩn mới",
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi không xác định";

        toast({
          title: "Không thể thêm",
          description: message,
          variant: "destructive",
        });
        return;
      }
    }
    setStandardFormOpen(false);
    setEditStandard(null);
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
    const payload: CertificateIssuerCreateRequest =
      buildOrganizationPayload(formData);

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
        await deleteStandard.mutateAsync(deleteItem.id);
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
    standardsSearchQuery,
    setStandardsSearchQuery,
    standardsStatusFilter,
    setStandardsStatusFilter,
    standardsPageSize,
    setStandardsPageSize,
    standardsCurrentIndex,
    setStandardsCurrentIndex,
    organizationSearchQuery,
    setOrganizationSearchQuery,
    organizationStatusFilter,
    setOrganizationStatusFilter,
    organizationPageSize,
    setOrganizationPageSize,
    organizationCurrentIndex,
    setOrganizationCurrentIndex,
    organizationsLoading: organizationsQuery.loading,
    organizationsError: organizationsQuery.error,
    organizationsResponse: organizationsQuery.response,
    standardsLoading: standardsQuery.loading,
    standardsError: standardsQuery.error,
    standardsResponse: standardsQuery.response,
    standardFormOpen,
    setStandardFormOpen,
    orgFormOpen,
    setOrgFormOpen,
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
    standardsPending:
      createStandard.isPending ||
      updateStandard.isPending ||
      deleteStandard.isPending,
    organizationsPending:
      createOrganization.isPending ||
      updateOrganization.isPending ||
      deleteOrganization.isPending,
  };
}
