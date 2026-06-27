import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { catalogApi } from "../api/foundation.api";
import type {
  CatalogType,
  CatalogQueryParams,
  CatalogRecordResponse,
  PageResponse,
} from "../types/foundation.type";

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const catalogKeys = {
  all: (catalog: CatalogType) => ["foundation", catalog] as const,
  list: (catalog: CatalogType, params?: CatalogQueryParams) =>
    ["foundation", catalog, "list", params ?? {}] as const,
  detail: (catalog: CatalogType, id: number) =>
    ["foundation", catalog, "detail", id] as const,
};

// ─── useCatalog (generic list hook) ──────────────────────────────────────────

interface UseCatalogOptions {
  params?: CatalogQueryParams;
  enabled?: boolean;
}

type UseCatalogResult<T> = UseQueryResult<PageResponse<T>, Error>;

/**
 * Generic hook để query danh sách cho bất kỳ catalog type nào.
 *
 * @example
 * const { items } = useCatalog("crop-groups");
 * const { items } = useCatalog("soil-types", { params: { status: "active" } });
 */
export function useCatalog<T = CatalogRecordResponse>(
  catalog: CatalogType,
  { params, enabled = true }: UseCatalogOptions = {},
) {
  const queryResult: UseCatalogResult<T> = useQuery<PageResponse<T>, Error>({
    queryKey: catalogKeys.list(catalog, params),
    queryFn: () => catalogApi.list(catalog, params) as Promise<PageResponse<T>>,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
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

// ─── useCatalogById ───────────────────────────────────────────────────────────

interface UseCatalogByIdOptions {
  enabled?: boolean;
}

/**
 * Hook để lấy chi tiết 1 record của bất kỳ catalog type.
 *
 * @example
 * const { data } = useCatalogById("crop-groups", 5);
 */
export function useCatalogById<T = CatalogRecordResponse>(
  catalog: CatalogType,
  id: number,
  { enabled = true }: UseCatalogByIdOptions = {},
) {
  return useQuery<T, Error>({
    queryKey: catalogKeys.detail(catalog, id),
    queryFn: () => catalogApi.getById(catalog, id) as Promise<T>,
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
