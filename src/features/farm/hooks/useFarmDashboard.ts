import { useQuery } from "@tanstack/react-query";
import { farmDashboardApi } from "../api/farm-dashboard.api";
import type { HarvestProductionQueryParams } from "../types/farm-dashboard.type";

const STALE_TIME_1_MIN = 60000;
const STALE_TIME_5_MIN = 300000;

export function useFarmDashboardAlerts() {
  const certsQuery = useQuery({
    queryKey: ["farm", "certificates", "expiring_soon"],
    queryFn: () => farmDashboardApi.getExpiringCertificates({ page: 0, size: 20 }),
    staleTime: STALE_TIME_1_MIN,
  });

  const lowStockQuery = useQuery({
    queryKey: ["farm", "dashboard", "low-stock-supplies"],
    queryFn: () => farmDashboardApi.getLowStockSupplies(),
    staleTime: STALE_TIME_1_MIN,
  });

  const contractsQuery = useQuery({
    queryKey: ["farm", "dashboard", "expiring-contracts"],
    queryFn: () => farmDashboardApi.getExpiringContracts(7),
    staleTime: STALE_TIME_1_MIN,
  });

  return {
    certCount: certsQuery.data?.totalElements ?? 0,
    lowStockData: lowStockQuery.data,
    contractData: contractsQuery.data,
    isLoading: certsQuery.isLoading || lowStockQuery.isLoading || contractsQuery.isLoading,
    refetchAll: () => {
      certsQuery.refetch();
      lowStockQuery.refetch();
      contractsQuery.refetch();
    },
  };
}

export function useFarmProductionHealth() {
  return useQuery({
    queryKey: ["farm", "dashboard", "production-health"],
    queryFn: () => farmDashboardApi.getProductionHealth(),
    staleTime: STALE_TIME_5_MIN,
  });
}

export function useFarmHarvestProduction(params?: HarvestProductionQueryParams) {
  return useQuery({
    queryKey: ["farm", "dashboard", "harvest-production", params],
    queryFn: () => farmDashboardApi.getHarvestProduction(params),
    staleTime: STALE_TIME_5_MIN,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 503) return false; // ClickHouse temp error
      return failureCount < 2;
    },
  });
}
