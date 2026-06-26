import { useQuery } from "@tanstack/react-query";
import { cropVarietyApi } from "../api/foundation.api";
import type {
  CropVarietyQueryParams,
  FoundationCropVarietyResponse,
  PageResponse,
} from "../types/foundation.type";

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const cropVarietyKeys = {
  all: () => ["foundation", "crop-varieties"] as const,
  list: (params?: CropVarietyQueryParams) =>
    ["foundation", "crop-varieties", "list", params ?? {}] as const,
  detail: (id: number) =>
    ["foundation", "crop-varieties", "detail", id] as const,
};

// ─── useCropVarieties ─────────────────────────────────────────────────────────

interface UseCropVarietiesOptions {
  params?: CropVarietyQueryParams;
  enabled?: boolean;
}

type UseCropVarietiesResult = ReturnType<
  typeof useQuery<PageResponse<FoundationCropVarietyResponse>, Error>
>;

/**
 * Hook để query danh sách giống cây trồng.
 * Có thể filter theo `cropId` để lấy giống của 1 cây cụ thể.
 *
 * @example
 * const { items } = useCropVarieties();
 * const { items } = useCropVarieties({ params: { cropId: 2, status: "active" } });
 */
export function useCropVarieties({
  params,
  enabled = true,
}: UseCropVarietiesOptions = {}) {
  const queryResult: UseCropVarietiesResult = useQuery<
    PageResponse<FoundationCropVarietyResponse>,
    Error
  >({
    queryKey: cropVarietyKeys.list(params),
    queryFn: () => cropVarietyApi.list(params),
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

// ─── useCropVarietyById ───────────────────────────────────────────────────────

interface UseCropVarietyByIdOptions {
  enabled?: boolean;
}

/**
 * Hook để lấy chi tiết 1 giống cây trồng.
 *
 * @example
 * const { data } = useCropVarietyById(10);
 */
export function useCropVarietyById(
  id: number,
  { enabled = true }: UseCropVarietyByIdOptions = {},
) {
  return useQuery<FoundationCropVarietyResponse, Error>({
    queryKey: cropVarietyKeys.detail(id),
    queryFn: () => cropVarietyApi.getById(id),
    enabled: enabled && !!id,
  });
}
