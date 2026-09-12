import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { farmDailyDiaryApi } from "../api/farm-daily-diary.api";
import type {
  FarmDailyDiaryQueryParams,
  FarmDailyDiaryStatsResponse,
} from "../types/farm-daily-diary.type";
import { farmDailyDiaryKeys } from "./useFarmDailyDiaryEntries";

interface UseFarmDailyDiaryStatsOptions {
  params?: FarmDailyDiaryQueryParams;
  enabled?: boolean;
}

export function useFarmDailyDiaryStats({
  params,
  enabled = true,
}: UseFarmDailyDiaryStatsOptions = {}) {
  const workspaceId = useSelectedWorkspaceId();

  return useQuery<FarmDailyDiaryStatsResponse, Error>({
    queryKey: [...farmDailyDiaryKeys.all(), "stats", workspaceId ?? "missing", params ?? {}] as const,
    queryFn: () => {
      if (workspaceId === null || workspaceId === undefined || workspaceId === "") {
        throw new Error("Missing workspace id for daily diary stats");
      }
      return farmDailyDiaryApi.getStats(params);
    },
    enabled:
      enabled &&
      workspaceId !== null &&
      workspaceId !== undefined &&
      workspaceId !== "",
    placeholderData: keepPreviousData,
  });
}
