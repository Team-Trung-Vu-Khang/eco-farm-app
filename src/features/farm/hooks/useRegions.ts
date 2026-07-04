import { useQuery } from "@tanstack/react-query";
import { regionApi } from "../api/farm.api";
import type { FarmRegionResponse, RegionQueryParams, FarmAreaResponse, AreaQueryParams } from "../types/farm.type";
import type { PageResponse } from "../../foundation/types/foundation.type";

export const regionKeys = {
  all: () => ["farm", "regions"] as const,
  list: (params?: RegionQueryParams) => ["farm", "regions", "list", params ?? {}] as const,
  detail: (id: number) => ["farm", "regions", "detail", id] as const,
  areas: (regionId: number, params?: AreaQueryParams) => ["farm", "regions", regionId, "areas", params ?? {}] as const,
};

interface UseRegionsOptions {
  params?: RegionQueryParams;
  enabled?: boolean;
}

type UseRegionsResult = ReturnType<typeof useQuery<PageResponse<FarmRegionResponse>, Error>>;

export function useRegions({ params, enabled = true }: UseRegionsOptions = {}) {
  const queryResult: UseRegionsResult = useQuery<PageResponse<FarmRegionResponse>, Error>({
    queryKey: regionKeys.list(params),
    queryFn: () => regionApi.list(params),
    enabled,
  });

  return {
    ...queryResult,
    items: queryResult.data?.content ?? [],
    response: queryResult.data ?? null,
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}

interface UseRegionByIdOptions {
  enabled?: boolean;
}

export function useRegionById(id: number, { enabled = true }: UseRegionByIdOptions = {}) {
  return useQuery<FarmRegionResponse, Error>({
    queryKey: regionKeys.detail(id),
    queryFn: () => regionApi.getById(id),
    enabled: enabled && !!id,
  });
}

interface UseRegionAreasOptions {
  params?: AreaQueryParams;
  enabled?: boolean;
}

export function useRegionAreas(regionId: number, { params, enabled = true }: UseRegionAreasOptions = {}) {
  const queryResult = useQuery<PageResponse<FarmAreaResponse>, Error>({
    queryKey: regionKeys.areas(regionId, params),
    queryFn: () => regionApi.getAreasByRegionId(regionId, params),
    enabled: enabled && !!regionId,
  });

  return {
    ...queryResult,
    items: queryResult.data?.content ?? [],
    response: queryResult.data ?? null,
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}
