import { useQuery } from "@tanstack/react-query";
import { cultivationZoneApi } from "../api/farm.api";
import type {
  FarmCultivationZoneResponse,
  CultivationZoneQueryParams,
} from "../types/farm.type";
import type { PageResponse } from "../../foundation/types/foundation.type";

export const cultivationZoneKeys = {
  all: () => ["farm", "cultivation-zones"] as const,
  list: (params?: CultivationZoneQueryParams) =>
    ["farm", "cultivation-zones", "list", params ?? {}] as const,
  detail: (id: number) =>
    ["farm", "cultivation-zones", "detail", id] as const,
};

interface UseCultivationZonesOptions {
  params?: CultivationZoneQueryParams;
  enabled?: boolean;
}

type UseCultivationZonesResult = ReturnType<
  typeof useQuery<PageResponse<FarmCultivationZoneResponse>, Error>
>;

export function useCultivationZones({
  params,
  enabled = true,
}: UseCultivationZonesOptions = {}) {
  const queryResult: UseCultivationZonesResult = useQuery<
    PageResponse<FarmCultivationZoneResponse>,
    Error
  >({
    queryKey: cultivationZoneKeys.list(params),
    queryFn: () => cultivationZoneApi.list(params),
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

interface UseCultivationZoneByIdOptions {
  enabled?: boolean;
}

export function useCultivationZoneById(
  id: number,
  { enabled = true }: UseCultivationZoneByIdOptions = {},
) {
  return useQuery<FarmCultivationZoneResponse, Error>({
    queryKey: cultivationZoneKeys.detail(id),
    queryFn: () => cultivationZoneApi.getById(id),
    enabled: enabled && !!id,
  });
}
