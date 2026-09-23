import { useQuery } from "@tanstack/react-query";
import { farmDailyDiaryApi } from "../api/farm-daily-diary.api";
import type {
  FarmDiaryQueryParams,
  PageResponseFarmDailyDiaryEntryResponse,
} from "../types/farm-daily-diary.type";

export function useFarmDiaryEntries(
  params: FarmDiaryQueryParams,
  options?: { enabled?: boolean },
) {
  const isEnabled = options?.enabled ?? true;

  return useQuery<PageResponseFarmDailyDiaryEntryResponse>({
    queryKey: ["farm", "diary-entries", params],
    queryFn: () => farmDailyDiaryApi.listGeneral(params),
    enabled: isEnabled,
    staleTime: 2 * 60 * 1000,
  });
}
