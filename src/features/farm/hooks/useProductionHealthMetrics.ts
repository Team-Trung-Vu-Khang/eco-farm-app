import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productionHealthMetricsApi } from "../api/farm.api";
import type {
  FarmProductionHealthMetricRequest,
  FarmProductionHealthMetricResponse,
  ProductionHealthMetricScopeQueryParams,
} from "../types/farm.type";

export const productionHealthMetricKeys = {
  workspace: () => ["farm", "production-health-metrics", "workspace"] as const,
  scope: (params?: ProductionHealthMetricScopeQueryParams) =>
    ["farm", "production-health-metrics", "scope", params ?? {}] as const,
};

interface UseProductionHealthMetricByScopeOptions {
  params?: ProductionHealthMetricScopeQueryParams;
  enabled?: boolean;
}

export function useProductionHealthMetricByScope({
  params,
  enabled = true,
}: UseProductionHealthMetricByScopeOptions = {}) {
  return useQuery<FarmProductionHealthMetricResponse, Error>({
    queryKey: productionHealthMetricKeys.scope(params),
    queryFn: () => productionHealthMetricsApi.getByScope(params!),
    enabled: enabled && !!params?.scopeType && Number.isFinite(params?.scopeId),
  });
}

export function useWorkspaceProductionHealthMetric({
  enabled = true,
}: { enabled?: boolean } = {}) {
  return useQuery<FarmProductionHealthMetricResponse, Error>({
    queryKey: productionHealthMetricKeys.workspace(),
    queryFn: () => productionHealthMetricsApi.listWorkspace(),
    enabled,
  });
}

export function useUpsertProductionHealthMetric() {
  const queryClient = useQueryClient();

  return useMutation<
    FarmProductionHealthMetricResponse,
    Error,
    FarmProductionHealthMetricRequest
  >({
    mutationFn: (data) => productionHealthMetricsApi.upsert(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: productionHealthMetricKeys.scope({
          scopeType: data.location!.scopeType,
          scopeId:
            data.location?.region?.id ??
            data.location?.area?.id ??
            data.location?.plot?.id ??
            0,
        }),
      });
      queryClient.invalidateQueries({
        queryKey: productionHealthMetricKeys.workspace(),
      });
    },
  });
}
