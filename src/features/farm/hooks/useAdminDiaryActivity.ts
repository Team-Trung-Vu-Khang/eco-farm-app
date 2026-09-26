import { useQuery } from "@tanstack/react-query";
import { adminDiaryActivityApi } from "../api/admin-diary-activity.api";
import type { AdminDiaryWorkspacesQueryParams } from "../types/admin-diary-activity.type";

const STALE_TIME_2_5_MIN = 150000; // 2.5 minutes (half of BE's 5-minute Redis TTL)

export function useAdminDiaryActivitySummary(month?: string) {
  return useQuery({
    queryKey: ["admin", "farm", "report", "diary-activity", "summary", month],
    queryFn: () => adminDiaryActivityApi.getDiaryActivitySummary(month),
    staleTime: STALE_TIME_2_5_MIN,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 2;
    },
  });
}

export function useAdminDiaryActivityWorkspaces(
  params?: AdminDiaryWorkspacesQueryParams,
  enabled = true,
) {
  return useQuery({
    queryKey: ["admin", "farm", "report", "diary-activity", "workspaces", params],
    queryFn: () => adminDiaryActivityApi.getDiaryActivityWorkspaces(params),
    enabled,
    staleTime: STALE_TIME_2_5_MIN,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 2;
    },
  });
}
