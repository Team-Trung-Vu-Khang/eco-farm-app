import { useQuery } from "@tanstack/react-query";
import { plotApi } from "../api/farm.api";
import type { FarmPlotResponse, PlotQueryParams } from "../types/farm.type";
import type { PageResponse } from "../../foundation/types/foundation.type";

export const plotKeys = {
  all: () => ["farm", "plots"] as const,
  list: (params?: PlotQueryParams) => ["farm", "plots", "list", params ?? {}] as const,
  detail: (id: number) => ["farm", "plots", "detail", id] as const,
};

interface UsePlotsOptions {
  params?: PlotQueryParams;
  enabled?: boolean;
}

type UsePlotsResult = ReturnType<typeof useQuery<PageResponse<FarmPlotResponse>, Error>>;

export function usePlots({ params, enabled = true }: UsePlotsOptions = {}) {
  const queryResult: UsePlotsResult = useQuery<PageResponse<FarmPlotResponse>, Error>({
    queryKey: plotKeys.list(params),
    queryFn: () => plotApi.list(params),
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

interface UsePlotByIdOptions {
  enabled?: boolean;
}

export function usePlotById(id: number, { enabled = true }: UsePlotByIdOptions = {}) {
  return useQuery<FarmPlotResponse, Error>({
    queryKey: plotKeys.detail(id),
    queryFn: () => plotApi.getById(id),
    enabled: enabled && !!id,
  });
}
