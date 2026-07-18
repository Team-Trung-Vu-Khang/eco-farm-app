import { useQuery } from "@tanstack/react-query";
import { plantIdentificationApi } from "../api/farm.api";
import type { FarmPlantIdentificationResponse, PlantIdentificationQueryParams } from "../types/farm.type";
import type { PageResponse } from "../../foundation/types/foundation.type";

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const plantKeys = {
  all: () => ["farm", "plant-identifications"] as const,
  list: (params?: PlantIdentificationQueryParams) =>
    ["farm", "plant-identifications", "list", params ?? {}] as const,
  detail: (id: number) => ["farm", "plant-identifications", "detail", id] as const,
};

// ─── usePlantIdentifications ───────────────────────────────────────────────────

interface UsePlantIdentificationsOptions {
  params?: PlantIdentificationQueryParams;
  enabled?: boolean;
}

type UsePlantIdentificationsResult = ReturnType<
  typeof useQuery<PageResponse<FarmPlantIdentificationResponse>, Error>
>;

/**
 * Hook để query danh sách định danh cây trồng.
 */
export function usePlantIdentifications({ params, enabled = true }: UsePlantIdentificationsOptions = {}) {
  const queryResult: UsePlantIdentificationsResult = useQuery<
    PageResponse<FarmPlantIdentificationResponse>,
    Error
  >({
    queryKey: plantKeys.list(params),
    queryFn: () => plantIdentificationApi.list(params),
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

// ─── usePlantIdentificationById ──────────────────────────────────────────────

interface UsePlantIdentificationByIdOptions {
  enabled?: boolean;
}

/**
 * Hook để lấy chi tiết định danh cây trồng theo ID.
 */
export function usePlantIdentificationById(
  id: number,
  { enabled = true }: UsePlantIdentificationByIdOptions = {},
) {
  return useQuery<FarmPlantIdentificationResponse, Error>({
    queryKey: plantKeys.detail(id),
    queryFn: () => plantIdentificationApi.getById(id),
    enabled: enabled && !!id,
  });
}
