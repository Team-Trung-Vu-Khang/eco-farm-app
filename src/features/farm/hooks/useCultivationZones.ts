import { useQuery } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace";
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
  detail: (id: number, workspaceId?: number) =>
    ["farm", "cultivation-zones", "detail", id, workspaceId ?? null] as const,
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
  const workspaceId = useSelectedWorkspaceId();
  const hasWorkspaceId =
    workspaceId !== null && workspaceId !== undefined && workspaceId !== "";

  const queryResult: UseCultivationZonesResult = useQuery<
    PageResponse<FarmCultivationZoneResponse>,
    Error
  >({
    queryKey: [...cultivationZoneKeys.list(params), workspaceId ?? "no-workspace"],
    queryFn: () => cultivationZoneApi.list(params),
    enabled: enabled && hasWorkspaceId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
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
  workspaceId?: number;
}

export function useCultivationZoneById(
  id: number,
  { enabled = true, workspaceId }: UseCultivationZoneByIdOptions = {},
) {
  return useQuery<FarmCultivationZoneResponse, Error>({
    queryKey: cultivationZoneKeys.detail(id, workspaceId),
    queryFn: () => cultivationZoneApi.getById(id, workspaceId),
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
