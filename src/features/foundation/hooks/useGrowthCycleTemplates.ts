import { useQuery } from "@tanstack/react-query";
import { growthCycleTemplateApi } from "../api/foundation.api";
import type {
  GrowthCycleTemplateQueryParams,
  FoundationGrowthCycleTemplateResponse,
  PageResponse,
} from "../types/foundation.type";

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const growthCycleTemplateKeys = {
  all: () => ["foundation", "growth-cycle-templates"] as const,
  list: (params?: GrowthCycleTemplateQueryParams) =>
    ["foundation", "growth-cycle-templates", "list", params ?? {}] as const,
  detail: (id: number) =>
    ["foundation", "growth-cycle-templates", "detail", id] as const,
};

// ─── useGrowthCycleTemplates ──────────────────────────────────────────────────

interface UseGrowthCycleTemplatesOptions {
  params?: GrowthCycleTemplateQueryParams;
  enabled?: boolean;
}

type UseGrowthCycleTemplatesResult = ReturnType<
  typeof useQuery<PageResponse<FoundationGrowthCycleTemplateResponse>, Error>
>;

/**
 * Hook để query danh sách template chu kỳ sinh trưởng.
 * Có thể filter theo `cropId`.
 *
 * @example
 * const { items } = useGrowthCycleTemplates();
 * const { items } = useGrowthCycleTemplates({ params: { cropId: 1, status: "active" } });
 */
export function useGrowthCycleTemplates({
  params,
  enabled = true,
}: UseGrowthCycleTemplatesOptions = {}) {
  const queryResult: UseGrowthCycleTemplatesResult = useQuery<
    PageResponse<FoundationGrowthCycleTemplateResponse>,
    Error
  >({
    queryKey: growthCycleTemplateKeys.list(params),
    queryFn: () => growthCycleTemplateApi.list(params),
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

// ─── useGrowthCycleTemplateById ───────────────────────────────────────────────

interface UseGrowthCycleTemplateByIdOptions {
  enabled?: boolean;
}

/**
 * Hook để lấy chi tiết 1 template chu kỳ sinh trưởng (bao gồm cả stages).
 *
 * @example
 * const { data } = useGrowthCycleTemplateById(7);
 */
export function useGrowthCycleTemplateById(
  id: number,
  { enabled = true }: UseGrowthCycleTemplateByIdOptions = {},
) {
  return useQuery<FoundationGrowthCycleTemplateResponse, Error>({
    queryKey: growthCycleTemplateKeys.detail(id),
    queryFn: () => growthCycleTemplateApi.getById(id),
    enabled: enabled && !!id,
  });
}
