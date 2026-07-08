import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useRegions } from "@/features/farm/hooks/useRegions";
import { farmCertificateApi } from "@/features/farm-certificate";
import { useMasterData } from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import type {
  EnterpriseCertificate,
  Standard,
} from "../../../stores/useEnterpriseCertificateStore";
import {
  mapFarmCertificateRecordToView,
  mapStandardRecordToOption,
  mapRegionRecordToArea,
} from "../utils";

export function useEnterpriseCertificateForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const workspaceId = useSelectedWorkspaceId();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [standardTypeFilter, setStandardTypeFilter] = useState("all");
  const [targetTypeFilter, setTargetTypeFilter] = useState("all");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<EnterpriseCertificate | null>(
    null,
  );

  const standardsQuery = useMasterData("certificate-standards", {
    params: {
      page: 0,
      size: 100,
    },
    enabled: true,
  });

  const regionsQuery = useRegions({
    params: {
      size: 100,
    },
    enabled: true,
  });

  const certificatesQuery = useQuery({
    queryKey: [
      "enterprise-certificate",
      "certificates",
      workspaceId,
      searchQuery,
      statusFilter,
      standardTypeFilter,
      targetTypeFilter,
    ] as const,
    queryFn: () =>
      farmCertificateApi.list({
        keyword: searchQuery.trim() || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        standardType:
          standardTypeFilter === "all" ? undefined : standardTypeFilter,
        targetType: targetTypeFilter === "all" ? undefined : targetTypeFilter,
        page: 0,
        size: 100,
      }),
    enabled: workspaceId !== null && workspaceId !== undefined,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const standards = useMemo<Standard[]>(
    () => standardsQuery.items.map(mapStandardRecordToOption),
    [standardsQuery.items],
  );

  const regions = useMemo(
    () => regionsQuery.items.map(mapRegionRecordToArea),
    [regionsQuery.items],
  );

  const filteredData = useMemo(
    () =>
      certificatesQuery.data?.content.map(mapFarmCertificateRecordToView) ?? [],
    [certificatesQuery.data?.content],
  );

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => farmCertificateApi.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["enterprise-certificate", "certificates"],
      });
    },
  });

  const handleDelete = (item: EnterpriseCertificate) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) {
      setDeleteOpen(false);
      return;
    }

    try {
      await deleteMutation.mutateAsync(deleteItem.id);
      toast({
        title: "Thành công",
        description: "Đã xóa chứng nhận",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";

      toast({
        title: "Không thể xóa",
        description: message,
        variant: "destructive",
      });
      return;
    }

    setDeleteOpen(false);
    setDeleteItem(null);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatusFilter(value);
    }

    if (key === "standardType") {
      setStandardTypeFilter(value);
    }

    if (key === "entityType") {
      setTargetTypeFilter(value);
    }
  };

  return {
    deleteOpen,
    setDeleteOpen,
    searchQuery,
    statusFilter,
    standardTypeFilter,
    targetTypeFilter,
    filteredData,
    standards,
    regions,
    loading:
      certificatesQuery.isLoading ||
      standardsQuery.loading ||
      regionsQuery.loading,
    error:
      certificatesQuery.error?.message ??
      standardsQuery.error ??
      regionsQuery.error ??
      null,
    handleSearch,
    handleFilterChange,
    handleDelete,
    handleConfirmDelete,
  };
}
