import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { branchApi } from "@/features/branch";
import { farmCertificateApi } from "@/features/farm-certificate";
import { useMasterData } from "@/features/master-data";
import { organizationApi } from "@/features/organization";
import { useSelectedWorkspaceId } from "@/features/workspace";
import type {
  EnterpriseCertificate,
  Standard,
} from "../../../stores/useEnterpriseCertificateStore";
import {
  mapBranchRecordToArea,
  mapFarmCertificateRecordToView,
  mapOrganizationRecordToEnterprise,
  mapStandardRecordToOption,
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

  const organizationsQuery = useQuery({
    queryKey: ["enterprise-certificate", "organizations", workspaceId] as const,
    queryFn: async () => {
      if (workspaceId === null || workspaceId === undefined) {
        throw new Error("Missing workspace id");
      }

      return organizationApi.list(
        {
          page: 0,
          size: 100,
        },
        workspaceId,
      );
    },
    enabled: workspaceId !== null && workspaceId !== undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const branchesQuery = useQuery({
    queryKey: ["enterprise-certificate", "branches", workspaceId] as const,
    queryFn: async () => {
      if (workspaceId === null || workspaceId === undefined) {
        throw new Error("Missing workspace id");
      }

      return branchApi.list(
        {
          page: 0,
          size: 100,
        },
        workspaceId,
      );
    },
    enabled: workspaceId !== null && workspaceId !== undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
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

  const enterprises = useMemo(
    () =>
      organizationsQuery.data?.content.map(mapOrganizationRecordToEnterprise) ??
      [],
    [organizationsQuery.data?.content],
  );

  const areas = useMemo(
    () => branchesQuery.data?.content.map(mapBranchRecordToArea) ?? [],
    [branchesQuery.data?.content],
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
    enterprises,
    areas,
    loading:
      certificatesQuery.isLoading ||
      standardsQuery.loading ||
      organizationsQuery.isLoading ||
      branchesQuery.isLoading,
    error:
      certificatesQuery.error?.message ??
      standardsQuery.error ??
      organizationsQuery.error?.message ??
      branchesQuery.error?.message ??
      null,
    handleSearch,
    handleFilterChange,
    handleDelete,
    handleConfirmDelete,
  };
}
