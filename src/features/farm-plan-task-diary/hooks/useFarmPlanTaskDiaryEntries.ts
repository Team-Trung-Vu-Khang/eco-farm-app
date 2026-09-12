import { useQuery } from "@tanstack/react-query";
import { farmPlanTaskDiaryApi } from "../api/farm-plan-task-diary.api";
import type {
  PlanTaskDiaryQueryParams,
  PlanTaskDiaryEntryPageResponse,
  PlanTaskDiaryEntryResponse,
} from "../types/farm-plan-task-diary.type";

export const farmPlanTaskDiaryKeys = {
  all: ["farm-plan-task-diary"] as const,
  lists: () => [...farmPlanTaskDiaryKeys.all, "list"] as const,
  list: (params?: PlanTaskDiaryQueryParams) =>
    [...farmPlanTaskDiaryKeys.lists(), params] as const,
  details: () => [...farmPlanTaskDiaryKeys.all, "detail"] as const,
  detail: (id: string | number) =>
    [...farmPlanTaskDiaryKeys.details(), id] as const,
  taskHistory: (taskId: string | number) =>
    [...farmPlanTaskDiaryKeys.all, "taskHistory", taskId] as const,
};

interface UseFarmPlanTaskDiaryEntriesOptions {
  params?: PlanTaskDiaryQueryParams;
  enabled?: boolean;
}

export function useFarmPlanTaskDiaryEntries({
  params,
  enabled = true,
}: UseFarmPlanTaskDiaryEntriesOptions = {}) {
  const queryResult = useQuery<PlanTaskDiaryEntryPageResponse, Error>({
    queryKey: farmPlanTaskDiaryKeys.list(params),
    queryFn: () => farmPlanTaskDiaryApi.list(params),
    enabled,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    items: queryResult.data?.content ?? [],
    pageData: queryResult.data ?? null,
    loading: queryResult.isLoading,
  };
}

export function useFarmPlanTaskDiaryEntryDetail(
  id: string | number,
  options?: { enabled?: boolean },
) {
  const queryResult = useQuery<PlanTaskDiaryEntryResponse, Error>({
    queryKey: farmPlanTaskDiaryKeys.detail(id),
    queryFn: () => farmPlanTaskDiaryApi.getById(id),
    enabled: options?.enabled ?? Boolean(id),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    item: queryResult.data ?? null,
    loading: queryResult.isLoading,
  };
}

export function useFarmTaskDiaryHistory(
  taskId: string | number,
  params?: { page?: number; size?: number },
  options?: { enabled?: boolean },
) {
  const queryResult = useQuery<PlanTaskDiaryEntryPageResponse, Error>({
    queryKey: farmPlanTaskDiaryKeys.taskHistory(taskId),
    queryFn: () => farmPlanTaskDiaryApi.getTaskHistory(taskId, params),
    enabled: options?.enabled ?? Boolean(taskId),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    items: queryResult.data?.content ?? [],
    pageData: queryResult.data ?? null,
    loading: queryResult.isLoading,
  };
}
