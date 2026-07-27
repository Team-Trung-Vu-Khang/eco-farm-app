import { useQuery } from "@tanstack/react-query";
import { methodApplicationApi } from "../api/foundation.api";
import type {
  MethodApplicationQueryParams,
  MethodApplication,
  PageResponse,
} from "../types/foundation.type";

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const methodApplicationKeys = {
  all: () => ["foundation", "method-applications"] as const,
  list: (params?: MethodApplicationQueryParams) =>
    ["foundation", "method-applications", "list", params ?? {}] as const,
  detail: (id: number) =>
    ["foundation", "method-applications", "detail", id] as const,
};

// ─── useMethodApplications ────────────────────────────────────────────────────

interface UseMethodApplicationsOptions {
  params?: MethodApplicationQueryParams;
  enabled?: boolean;
}

type UseMethodApplicationsResult = ReturnType<
  typeof useQuery<PageResponse<MethodApplication>, Error>
>;

/**
 * Hook để query danh sách liên kết phương pháp sản xuất (Method Applications).
 *
 * @example
 * const { items } = useMethodApplications({ params: { domainCode: "CROP" } });
 */
export function useMethodApplications({
  params,
  enabled = true,
}: UseMethodApplicationsOptions = {}) {
  const queryResult: UseMethodApplicationsResult = useQuery<
    PageResponse<MethodApplication>,
    Error
  >({
    queryKey: methodApplicationKeys.list(params),
    queryFn: () => methodApplicationApi.list(params),
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

// ─── useMethodApplicationById ─────────────────────────────────────────────────

interface UseMethodApplicationByIdOptions {
  enabled?: boolean;
}

/**
 * Hook để lấy chi tiết 1 bản ghi method-application.
 */
export function useMethodApplicationById(
  id: number,
  { enabled = true }: UseMethodApplicationByIdOptions = {},
) {
  return useQuery<MethodApplication, Error>({
    queryKey: methodApplicationKeys.detail(id),
    queryFn: () => methodApplicationApi.getById(id),
    enabled: enabled && !!id,
  });
}
