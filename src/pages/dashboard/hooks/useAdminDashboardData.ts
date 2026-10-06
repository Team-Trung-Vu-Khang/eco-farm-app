import {
  useAdminWorkspaceStats,
  useAdminActiveFarmersReport,
  useAdminHarvestByVariant,
} from "@/features/farm/hooks/useAdminDashboard";

interface UseAdminDashboardDataOptions {
  enabled?: boolean;
}

export function useAdminDashboardData({
  enabled = true,
}: UseAdminDashboardDataOptions = {}) {
  const workspaceStatsQuery = useAdminWorkspaceStats(enabled);
  const activeFarmersReportQuery = useAdminActiveFarmersReport(
    undefined,
    enabled,
  );
  const harvestByVariantQuery = useAdminHarvestByVariant(undefined, enabled);

  const isLoading =
    enabled &&
    (workspaceStatsQuery.isLoading ||
      activeFarmersReportQuery.isLoading ||
      harvestByVariantQuery.isLoading);

  return {
    workspaceStats: workspaceStatsQuery.data ?? null,
    activeFarmersReport: activeFarmersReportQuery.data ?? null,
    harvestByVariant: harvestByVariantQuery.data ?? null,
    isLoading,
    refetchAll: () => {
      if (!enabled) return;
      workspaceStatsQuery.refetch();
      activeFarmersReportQuery.refetch();
      harvestByVariantQuery.refetch();
    },
  };
}
