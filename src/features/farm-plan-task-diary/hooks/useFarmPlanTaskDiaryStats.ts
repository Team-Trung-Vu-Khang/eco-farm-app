import { useQuery } from "@tanstack/react-query";
import { farmPlanTaskDiaryApi } from "../api/farm-plan-task-diary.api";
import type {
  PlanTaskDiaryQueryParams,
  PlanTaskDiaryStatsResponse,
} from "../types/farm-plan-task-diary.type";
import { farmPlanTaskDiaryKeys } from "./useFarmPlanTaskDiaryEntries";

interface UseFarmPlanTaskDiaryStatsOptions {
  params?: PlanTaskDiaryQueryParams;
  enabled?: boolean;
}

export function useFarmPlanTaskDiaryStats({
  params,
  enabled = true,
}: UseFarmPlanTaskDiaryStatsOptions = {}) {
  const queryResult = useQuery<PlanTaskDiaryStatsResponse, Error>({
    queryKey: [...farmPlanTaskDiaryKeys.all, "stats", params ?? {}] as const,
    queryFn: () => farmPlanTaskDiaryApi.getStats(params),
    enabled,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    data: queryResult.data ?? null,
    loading: queryResult.isLoading,
  };
}
