import { useQuery } from "@tanstack/react-query";
import { productionZoneHarvestApi } from "../api/farm.api";
import type { FarmZoneHarvestBySubjectResponse } from "../types/farm.type";

export function useProductionZoneHarvestBySubject(
  zoneId: number | string | undefined | null,
  params?: { periodType?: "MONTHLY" | "YEARLY" },
  options?: { enabled?: boolean },
) {
  const numericZoneId = zoneId ? Number(zoneId) : 0;
  const isEnabled = (options?.enabled ?? true) && numericZoneId > 0;

  return useQuery<FarmZoneHarvestBySubjectResponse>({
    queryKey: [
      "farm",
      "production-zones",
      numericZoneId,
      "harvest-by-subject",
      params,
    ],
    queryFn: () => productionZoneHarvestApi.getBySubject(numericZoneId, params),
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
  });
}
