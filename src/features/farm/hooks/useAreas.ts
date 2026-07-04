import { useQuery } from "@tanstack/react-query";
import { areaApi } from "../api/farm.api";
import type { FarmAreaResponse, AreaQueryParams, FarmPlotResponse, PlotQueryParams } from "../types/farm.type";
import type { PageResponse } from "../../foundation/types/foundation.type";

export const areaKeys = {
  all: () => ["farm", "areas"] as const,
  list: (params?: AreaQueryParams) => ["farm", "areas", "list", params ?? {}] as const,
  detail: (id: number) => ["farm", "areas", "detail", id] as const,
  plots: (areaId: number, params?: PlotQueryParams) => ["farm", "areas", areaId, "plots", params ?? {}] as const,
};

interface UseAreasOptions {
  params?: AreaQueryParams;
  enabled?: boolean;
}

type UseAreasResult = ReturnType<typeof useQuery<PageResponse<FarmAreaResponse>, Error>>;

export function useAreas({ params, enabled = true }: UseAreasOptions = {}) {
  const queryResult: UseAreasResult = useQuery<PageResponse<FarmAreaResponse>, Error>({
    queryKey: areaKeys.list(params),
    queryFn: () => areaApi.list(params),
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

interface UseAreaByIdOptions {
  enabled?: boolean;
}

export function useAreaById(id: number, { enabled = true }: UseAreaByIdOptions = {}) {
  return useQuery<FarmAreaResponse, Error>({
    queryKey: areaKeys.detail(id),
    queryFn: () => areaApi.getById(id),
    enabled: enabled && !!id,
  });
}

interface UseAreaPlotsOptions {
  params?: PlotQueryParams;
  enabled?: boolean;
}

export function useAreaPlots(areaId: number, { params, enabled = true }: UseAreaPlotsOptions = {}) {
  const queryResult = useQuery<PageResponse<FarmPlotResponse>, Error>({
    queryKey: areaKeys.plots(areaId, params),
    queryFn: () => areaApi.getPlotsByAreaId(areaId, params),
    enabled: enabled && !!areaId,
  });

  return {
    ...queryResult,
    items: queryResult.data?.content ?? [],
    response: queryResult.data ?? null,
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}
