import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { farmCertificateApi } from "@/features/farm-certificate";
import { useMasterData } from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { useDebounce } from "@/shared/hooks/useDebounce";
import type {
  EnterpriseCertificate,
  Standard,
} from "../../../stores/useEnterpriseCertificateStore";
import {
  mapFarmCertificateRecordToView,
  mapStandardRecordToOption,
} from "../utils";

export function useEnterpriseCertificateForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const workspaceId = useSelectedWorkspaceId();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const [statusFilter, setStatusFilter] = useState("all");
  const [standardTypeFilter, setStandardTypeFilter] = useState("all");
  const [targetTypeFilter, setTargetTypeFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);

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

  const certificatesQuery = useQuery({
    queryKey: [
      "enterprise-certificate",
      "certificates",
      workspaceId,
      debouncedSearchQuery,
      statusFilter,
      standardTypeFilter,
      targetTypeFilter,
      currentIndex,
      pageSize,
    ] as const,
    queryFn: () =>
      farmCertificateApi.list({
        keyword: debouncedSearchQuery.trim() || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        standardType:
          standardTypeFilter === "all" ? undefined : standardTypeFilter,
        targetType: targetTypeFilter === "all" ? undefined : targetTypeFilter,
        page: Math.max(currentIndex - 1, 0),
        size: pageSize,
      }),
    enabled: workspaceId !== null && workspaceId !== undefined,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const filteredData = useMemo(
    () =>
      certificatesQuery.data?.content.map(mapFarmCertificateRecordToView) ?? [],
    [certificatesQuery.data?.content],
  );

  const standards = useMemo<Standard[]>(
    () => standardsQuery.items.map(mapStandardRecordToOption),
    [standardsQuery.items],
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
    setCurrentIndex(1);
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentIndex(1);
  };

  const handleIndexChange = (value: number) => {
    setCurrentIndex(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatusFilter(value);
      setCurrentIndex(1);
    }

    if (key === "standardType") {
      setStandardTypeFilter(value);
      setCurrentIndex(1);
    }

    if (key === "entityType") {
      setTargetTypeFilter(value);
      setCurrentIndex(1);
    }
  };

  return {
    deleteOpen,
    setDeleteOpen,
    searchQuery,
    debouncedSearchQuery,
    statusFilter,
    standardTypeFilter,
    targetTypeFilter,
    filteredData,
    standards,
    response: certificatesQuery.data,
    loading: certificatesQuery.isLoading || standardsQuery.loading,
    error: certificatesQuery.error?.message ?? standardsQuery.error ?? null,
    handleSearch,
    handleFilterChange,
    handleDelete,
    handleConfirmDelete,
    pageSize,
    handlePageSizeChange,
    currentIndex,
    handleIndexChange,
  };
}
