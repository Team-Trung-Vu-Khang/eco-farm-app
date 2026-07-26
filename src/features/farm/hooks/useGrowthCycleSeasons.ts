import { useQuery } from "@tanstack/react-query";
import { farmGrowthCycleSeasonApi, systemGrowthCycleSeasonApi } from "../api/growth-cycle-season.api";
import type { PageResponse } from "@/features/foundation/types/foundation.type";

export const growthCycleSeasonKeys = {
  all: () => ["growth-cycle-seasons"] as const,
  userList: (params?: any) => ["growth-cycle-seasons", "user", "list", params ?? {}] as const,
  systemList: (params?: any) => ["growth-cycle-seasons", "system", "list", params ?? {}] as const,
  userDetail: (id: string | number) => ["growth-cycle-seasons", "user", "detail", id] as const,
  systemDetail: (id: string | number) => ["growth-cycle-seasons", "system", "detail", id] as const,
};

export function useUserGrowthCycleSeasons({ params, enabled = true }: { params?: any; enabled?: boolean } = {}) {
  const queryResult = useQuery<PageResponse<any>, Error>({
    queryKey: growthCycleSeasonKeys.userList(params),
    queryFn: () => farmGrowthCycleSeasonApi.list(params),
    enabled,
  });

  return {
    ...queryResult,
    items: queryResult.data?.content ?? [],
    response: queryResult.data ?? null,
    loading: queryResult.isLoading,
  };
}

export function useSystemGrowthCycleSeasons({ params, enabled = true }: { params?: any; enabled?: boolean } = {}) {
  const queryResult = useQuery<PageResponse<any>, Error>({
    queryKey: growthCycleSeasonKeys.systemList(params),
    queryFn: () => systemGrowthCycleSeasonApi.list(params),
    enabled,
  });

  return {
    ...queryResult,
    items: queryResult.data?.content ?? [],
    response: queryResult.data ?? null,
    loading: queryResult.isLoading,
  };
}

export function useUserGrowthCycleSeasonById(id: string | number, { enabled = true }: { enabled?: boolean } = {}) {
  return useQuery<any, Error>({
    queryKey: growthCycleSeasonKeys.userDetail(id),
    queryFn: () => farmGrowthCycleSeasonApi.getById(id),
    enabled: enabled && !!id,
  });
}

export function useSystemGrowthCycleSeasonById(id: string | number, { enabled = true }: { enabled?: boolean } = {}) {
  return useQuery<any, Error>({
    queryKey: growthCycleSeasonKeys.systemDetail(id),
    queryFn: () => systemGrowthCycleSeasonApi.getById(id),
    enabled: enabled && !!id,
  });
}
