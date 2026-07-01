import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { farmPositionResponsibilityApi } from "../api/farm-master-data.api";
import type {
  FarmPositionResponsibilityResponse,
  PositionResponsibilityQueryParams,
} from "../types/farm-master-data.type";

export const farmPositionResponsibilityKeys = {
  all: (positionId: number) => ["farm-position-responsibilities", positionId] as const,
  list: (positionId: number, params?: PositionResponsibilityQueryParams) =>
    [...farmPositionResponsibilityKeys.all(positionId), "list", params ?? {}] as const,
};

interface UseFarmPositionResponsibilitiesOptions {
  params?: PositionResponsibilityQueryParams;
  enabled?: boolean;
}

export function useFarmPositionResponsibilities(
  positionId: number,
  { params, enabled = true }: UseFarmPositionResponsibilitiesOptions = {}
) {
  const queryResult = useQuery<FarmPositionResponsibilityResponse[], Error>({
    queryKey: farmPositionResponsibilityKeys.list(positionId, params),
    queryFn: () => farmPositionResponsibilityApi.list(positionId, params),
    enabled: enabled && !!positionId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    items: queryResult.data ?? [],
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}
