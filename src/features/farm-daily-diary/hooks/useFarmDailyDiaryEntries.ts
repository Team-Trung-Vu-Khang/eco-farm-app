import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { farmDailyDiaryApi } from "../api/farm-daily-diary.api";
import type {
  FarmDailyDiaryEntryResponse,
  FarmDailyDiaryQueryParams,
  PageResponseFarmDailyDiaryEntryResponse,
} from "../types/farm-daily-diary.type";

export const farmDailyDiaryKeys = {
  all: () => ["farm-daily-diary-entries"] as const,
  list: (
    workspaceId: number | string | null | undefined,
    params?: FarmDailyDiaryQueryParams,
  ) => [...farmDailyDiaryKeys.all(), "list", workspaceId ?? "missing", params ?? {}] as const,
  detail: (
    workspaceId: number | string | null | undefined,
    id: string,
  ) => [...farmDailyDiaryKeys.all(), "detail", workspaceId ?? "missing", id] as const,
};

interface UseFarmDailyDiaryEntriesOptions {
  params?: FarmDailyDiaryQueryParams;
  enabled?: boolean;
}

export function useFarmDailyDiaryEntries({
  params,
  enabled = true,
}: UseFarmDailyDiaryEntriesOptions = {}) {
  const workspaceId = useSelectedWorkspaceId();

  return useQuery<PageResponseFarmDailyDiaryEntryResponse, Error>({
    queryKey: farmDailyDiaryKeys.list(workspaceId, params),
    queryFn: () => {
      if (workspaceId === null || workspaceId === undefined || workspaceId === "") {
        throw new Error("Missing workspace id for daily diary entries");
      }
      return farmDailyDiaryApi.list(params);
    },
    enabled:
      enabled &&
      workspaceId !== null &&
      workspaceId !== undefined &&
      workspaceId !== "",
    placeholderData: keepPreviousData,
  });
}

export function useFarmDailyDiaryEntryDetail(
  id?: string,
  enabled = true,
) {
  const workspaceId = useSelectedWorkspaceId();

  return useQuery<FarmDailyDiaryEntryResponse, Error>({
    queryKey: farmDailyDiaryKeys.detail(workspaceId, id ?? ""),
    queryFn: () => {
      if (!id) throw new Error("Missing id for daily diary detail");
      return farmDailyDiaryApi.getById(id);
    },
    enabled:
      enabled &&
      Boolean(id) &&
      workspaceId !== null &&
      workspaceId !== undefined &&
      workspaceId !== "",
  });
}
