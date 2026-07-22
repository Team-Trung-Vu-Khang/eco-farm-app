import { useQuery } from "@tanstack/react-query";
import { lifecycleTemplateApi } from "../api/foundation.api";
import type {
  LifecycleTemplateQueryParams,
  LifecycleTemplate,
  PageResponse,
} from "../types/foundation.type";

export const lifecycleTemplateKeys = {
  all: () => ["foundation", "lifecycle-templates"] as const,
  list: (params?: LifecycleTemplateQueryParams) =>
    ["foundation", "lifecycle-templates", "list", params ?? {}] as const,
  detail: (id: number) =>
    ["foundation", "lifecycle-templates", "detail", id] as const,
};

interface UseLifecycleTemplatesOptions {
  params?: LifecycleTemplateQueryParams;
  enabled?: boolean;
}

type UseLifecycleTemplatesResult = ReturnType<
  typeof useQuery<PageResponse<LifecycleTemplate>, Error>
>;

export function useLifecycleTemplates({
  params,
  enabled = true,
}: UseLifecycleTemplatesOptions = {}) {
  const queryResult: UseLifecycleTemplatesResult = useQuery<
    PageResponse<LifecycleTemplate>,
    Error
  >({
    queryKey: lifecycleTemplateKeys.list(params),
    queryFn: () => lifecycleTemplateApi.list(params),
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

interface UseLifecycleTemplateByIdOptions {
  enabled?: boolean;
}

export function useLifecycleTemplateById(
  id: number,
  { enabled = true }: UseLifecycleTemplateByIdOptions = {},
) {
  return useQuery<LifecycleTemplate, Error>({
    queryKey: lifecycleTemplateKeys.detail(id),
    queryFn: () => lifecycleTemplateApi.getById(id),
    enabled: enabled && !!id,
  });
}
