import { useQuery } from "@tanstack/react-query";
import { cropApi } from "../api/foundation.api";
import type {
  CropQueryParams,
  FoundationCropResponse,
  PageResponse,
} from "../types/foundation.type";

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const cropKeys = {
  all: () => ["foundation", "crops"] as const,
  list: (params?: CropQueryParams) =>
    ["foundation", "crops", "list", params ?? {}] as const,
  detail: (id: number) => ["foundation", "crops", "detail", id] as const,
};

// ─── useCrops ─────────────────────────────────────────────────────────────────

interface UseCropsOptions {
  params?: CropQueryParams;
  enabled?: boolean;
}

type UseCropsResult = ReturnType<
  typeof useQuery<PageResponse<FoundationCropResponse>, Error>
>;

/**
 * Hook để query danh sách cây trồng (Foundation Crops).
 *
 * @example
 * const { items, loading } = useCrops();
 * const { items } = useCrops({ params: { keyword: "lúa", status: "active" } });
 */
export function useCrops({ params, enabled = true }: UseCropsOptions = {}) {
  const queryResult: UseCropsResult = useQuery<
    PageResponse<FoundationCropResponse>,
    Error
  >({
    queryKey: cropKeys.list(params),
    queryFn: () => cropApi.list(params),
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

// ─── useCropById ──────────────────────────────────────────────────────────────

interface UseCropByIdOptions {
  enabled?: boolean;
}

/**
 * Hook để lấy chi tiết 1 cây trồng.
 *
 * @example
 * const { data } = useCropById(3);
 */
export function useCropById(
  id: number,
  { enabled = true }: UseCropByIdOptions = {},
) {
  return useQuery<FoundationCropResponse, Error>({
    queryKey: cropKeys.detail(id),
    queryFn: () => cropApi.getById(id),
    enabled: enabled && !!id,
  });
}
