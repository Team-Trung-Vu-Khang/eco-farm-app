import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { farmDailyDiaryApi } from "../api/farm-daily-diary.api";
import { farmDailyDiaryKeys } from "./useFarmDailyDiaryEntries";
import type {
  FarmDailyDiaryQueryParams,
  PageResponseFarmDailyDiaryEntryResponse,
} from "../types/farm-daily-diary.type";

interface UseInfiniteFarmDailyDiaryEntriesOptions {
  params?: Omit<FarmDailyDiaryQueryParams, "page">;
  pageSize?: number;
  enabled?: boolean;
}

export function useInfiniteFarmDailyDiaryEntries({
  params,
  pageSize = 10,
  enabled = true,
}: UseInfiniteFarmDailyDiaryEntriesOptions = {}) {
  const workspaceId = useSelectedWorkspaceId();

  return useInfiniteQuery<PageResponseFarmDailyDiaryEntryResponse, Error>({
    queryKey: [
      ...farmDailyDiaryKeys.all(),
      "infinite",
      workspaceId ?? "missing",
      params ?? {},
      pageSize,
    ],
    queryFn: ({ pageParam = 0 }) => {
      if (
        workspaceId === null ||
        workspaceId === undefined ||
        workspaceId === ""
      ) {
        throw new Error("Missing workspace id for daily diary entries");
      }
      return farmDailyDiaryApi.list({
        ...params,
        page: pageParam as number,
        size: pageSize,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.page ?? 0;
      const totalPages = lastPage.totalPages ?? 0;
      return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
    },
    enabled:
      enabled &&
      workspaceId !== null &&
      workspaceId !== undefined &&
      workspaceId !== "",
  });
}
