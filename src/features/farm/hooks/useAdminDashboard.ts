import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { adminDashboardApi } from "../api/admin-dashboard.api";
import type { CreateExportJobPayload } from "../types/admin-dashboard.type";

const STALE_TIME_2_5_MIN = 150000; // 2.5 minutes (half of BE's 5-minute Redis TTL)

export function useAdminWorkspaceStats() {
  return useQuery({
    queryKey: ["admin", "dashboard", "workspaces"],
    queryFn: () => adminDashboardApi.getWorkspaceStats(),
    staleTime: STALE_TIME_2_5_MIN,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 2;
    },
  });
}

export function useAdminActiveFarmersReport(params?: {
  month?: string;
  size?: number;
}) {
  return useQuery({
    queryKey: ["admin", "farm", "report", "active-farmers", params],
    queryFn: () => adminDashboardApi.getActiveFarmersReport(params),
    staleTime: STALE_TIME_2_5_MIN,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 2;
    },
  });
}

export function useAdminActiveFarmersWorkspaces(
  params?: {
    month?: string;
    status?: "ACTIVE" | "INACTIVE";
    page?: number;
    size?: number;
  },
  enabled = true,
) {
  return useQuery({
    queryKey: ["admin", "farm", "report", "active-farmers-workspaces", params],
    queryFn: () => adminDashboardApi.getActiveFarmersWorkspaces(params),
    enabled,
    staleTime: STALE_TIME_2_5_MIN,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 2;
    },
  });
}

export function useAdminHarvestByVariant(params?: {
  domainCode?: string;
  fromMonth?: string;
  toMonth?: string;
  top?: number;
}) {
  return useQuery({
    queryKey: ["admin", "farm", "report", "harvest-by-variant", params],
    queryFn: () => adminDashboardApi.getHarvestByVariant(params),
    staleTime: STALE_TIME_2_5_MIN,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 2;
    },
  });
}

export function useAdminHarvestByVariantDetail(
  params: {
    variantCode: string;
    domainCode?: string;
    fromMonth?: string;
    toMonth?: string;
    limit?: number;
  },
  enabled = true,
) {
  return useQuery({
    queryKey: ["admin", "farm", "report", "harvest-by-variant-detail", params],
    queryFn: () => adminDashboardApi.getHarvestByVariantDetail(params),
    enabled: Boolean(params.variantCode) && enabled,
    staleTime: STALE_TIME_2_5_MIN,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 2;
    },
  });
}

export function useAdminExportActiveFarmersJob() {
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const createJobMutation = useMutation({
    mutationFn: (payload: CreateExportJobPayload) =>
      adminDashboardApi.createActiveFarmersExportJob(payload),
    onSuccess: (data) => {
      if (data?.id) {
        setActiveJobId(data.id);
      }
    },
  });

  const pollJobQuery = useQuery({
    queryKey: ["admin", "export-job", activeJobId],
    queryFn: () => adminDashboardApi.getExportJobStatus(activeJobId!),
    enabled: Boolean(activeJobId),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === "DONE" || data?.status === "FAILED") {
        return false;
      }
      return 5000; // Poll every 5 seconds as requested by user
    },
  });

  const isExporting =
    createJobMutation.isPending ||
    (Boolean(activeJobId) &&
      pollJobQuery.data?.status !== "DONE" &&
      pollJobQuery.data?.status !== "FAILED");

  const resetExport = () => {
    setActiveJobId(null);
  };

  return {
    startExport: createJobMutation.mutateAsync,
    isStarting: createJobMutation.isPending,
    createError: createJobMutation.error,
    activeJobId,
    jobStatusData: pollJobQuery.data,
    isExporting,
    resetExport,
  };
}
