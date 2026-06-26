import { useQuery } from "@tanstack/react-query";
import { farmingMethodCropApi } from "../api/foundation.api";
import type {
  FarmingMethodCropQueryParams,
  FarmingMethodCropResponse,
  PageResponse,
} from "../types/foundation.type";

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const farmingMethodCropKeys = {
  all: () => ["foundation", "farming-method-crops"] as const,
  list: (params?: FarmingMethodCropQueryParams) =>
    ["foundation", "farming-method-crops", "list", params ?? {}] as const,
  detail: (id: number) =>
    ["foundation", "farming-method-crops", "detail", id] as const,
};

// ─── useFarmingMethodCrops ────────────────────────────────────────────────────

interface UseFarmingMethodCropsOptions {
  params?: FarmingMethodCropQueryParams;
  enabled?: boolean;
}

type UseFarmingMethodCropsResult = ReturnType<
  typeof useQuery<PageResponse<FarmingMethodCropResponse>, Error>
>;

/**
 * Hook để query danh sách liên kết phương pháp canh tác – cây trồng.
 *
 * @example
 * const { items } = useFarmingMethodCrops();
 * const { items } = useFarmingMethodCrops({ params: { status: "active" } });
 */
export function useFarmingMethodCrops({
  params,
  enabled = true,
}: UseFarmingMethodCropsOptions = {}) {
  const queryResult: UseFarmingMethodCropsResult = useQuery<
    PageResponse<FarmingMethodCropResponse>,
    Error
  >({
    queryKey: farmingMethodCropKeys.list(params),
    queryFn: () => farmingMethodCropApi.list(params),
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

// ─── useFarmingMethodCropById ─────────────────────────────────────────────────

interface UseFarmingMethodCropByIdOptions {
  enabled?: boolean;
}

/**
 * Hook để lấy chi tiết 1 bản ghi farming-method-crop (gồm danh sách crops gán vào).
 *
 * @example
 * const { data } = useFarmingMethodCropById(2);
 */
export function useFarmingMethodCropById(
  id: number,
  { enabled = true }: UseFarmingMethodCropByIdOptions = {},
) {
  return useQuery<FarmingMethodCropResponse, Error>({
    queryKey: farmingMethodCropKeys.detail(id),
    queryFn: () => farmingMethodCropApi.getById(id),
    enabled: enabled && !!id,
  });
}
