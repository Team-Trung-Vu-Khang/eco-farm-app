import type { PageResponse } from "@/features/foundation/types/foundation.type";
import { useQuery } from "@tanstack/react-query";
import { taskCategoryApi } from "../api/task-category.api";
import type {
  TaskCategoryLookupQueryParams,
  TaskCategoryLookupResponse,
  TaskCategoryStageQueryParams,
  TaskCategoryStageResponse,
} from "../types/task-category.type";

export const taskCategoryKeys = {
  all: () => ["task-categories"] as const,
  stages: (params?: TaskCategoryStageQueryParams) =>
    [...taskCategoryKeys.all(), "stages", params ?? {}] as const,
  search: (params?: TaskCategoryLookupQueryParams) =>
    [...taskCategoryKeys.all(), "search", params ?? {}] as const,
};

interface UseTaskCategoryStagesOptions {
  params?: TaskCategoryStageQueryParams;
  enabled?: boolean;
}

export function useTaskCategoryStages({
  params,
  enabled = true,
}: UseTaskCategoryStagesOptions = {}) {
  return useQuery<TaskCategoryStageResponse[], Error>({
    queryKey: taskCategoryKeys.stages(params),
    queryFn: () => taskCategoryApi.listStages(params),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

interface UseTaskCategorySearchOptions {
  params?: TaskCategoryLookupQueryParams;
  enabled?: boolean;
}

export function useTaskCategorySearch({
  params,
  enabled = true,
}: UseTaskCategorySearchOptions = {}) {
  const queryResult = useQuery<PageResponse<TaskCategoryLookupResponse>, Error>({
    queryKey: taskCategoryKeys.search(params),
    queryFn: () => taskCategoryApi.search({ size: 100, ...params }),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    items: queryResult.data?.content ?? [],
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}
