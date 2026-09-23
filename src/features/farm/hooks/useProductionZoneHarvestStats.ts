import { useQuery } from "@tanstack/react-query";
import { productionZoneHarvestApi } from "../api/farm.api";
import type { FarmZoneHarvestStatsResponse } from "../types/farm.type";

export function useProductionZoneHarvestStats(
  zoneId: number | string | undefined | null,
  options?: { enabled?: boolean },
) {
  const numericZoneId = zoneId ? Number(zoneId) : 0;
  const isEnabled = (options?.enabled ?? true) && numericZoneId > 0;

  return useQuery<FarmZoneHarvestStatsResponse>({
    queryKey: ["farm", "production-zones", numericZoneId, "harvest-stats"],
    queryFn: () => productionZoneHarvestApi.getStats(numericZoneId),
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
  });
}
