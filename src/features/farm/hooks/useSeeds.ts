import { useQuery } from "@tanstack/react-query";
import { seedApi } from "../api/farm.api";
import type { FarmSeedResponse, SeedQueryParams } from "../types/farm.type";
import type { PageResponse } from "../../foundation/types/foundation.type";

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const seedKeys = {
  all: () => ["farm", "seeds"] as const,
  list: (params?: SeedQueryParams) =>
    ["farm", "seeds", "list", params ?? {}] as const,
  detail: (id: number) => ["farm", "seeds", "detail", id] as const,
};

// ─── useSeeds ─────────────────────────────────────────────────────────────────

interface UseSeedsOptions {
  params?: SeedQueryParams;
  enabled?: boolean;
}

type UseSeedsResult = ReturnType<
  typeof useQuery<PageResponse<FarmSeedResponse>, Error>
>;

/**
 * Hook để query danh sách hạt giống (Farm Seeds).
 *
 * @example
 * const { items, loading } = useSeeds();
 * const { items } = useSeeds({ params: { keyword: "Ri6", status: "active" } });
 */
export function useSeeds({ params, enabled = true }: UseSeedsOptions = {}) {
  const queryResult: UseSeedsResult = useQuery<
    PageResponse<FarmSeedResponse>,
    Error
  >({
    queryKey: seedKeys.list(params),
    queryFn: () => seedApi.list(params),
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

// ─── useSeedById ──────────────────────────────────────────────────────────────

interface UseSeedByIdOptions {
  enabled?: boolean;
}

/**
 * Hook để lấy chi tiết 1 hạt giống.
 *
 * @example
 * const { data } = useSeedById(12);
 */
export function useSeedById(
  id: number,
  { enabled = true }: UseSeedByIdOptions = {},
) {
  return useQuery<FarmSeedResponse, Error>({
    queryKey: seedKeys.detail(id),
    queryFn: () => seedApi.getById(id),
    enabled: enabled && !!id,
  });
}
