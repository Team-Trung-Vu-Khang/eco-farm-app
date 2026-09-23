import { useQuery } from "@tanstack/react-query";
import { productionZoneHarvestApi } from "../api/farm.api";
import type {
  FarmZoneHarvestChartQueryParams,
  FarmZoneHarvestChartResponse,
} from "../types/farm.type";

export function useProductionZoneHarvestChart(
  zoneId: number | string | undefined | null,
  params?: FarmZoneHarvestChartQueryParams,
  options?: { enabled?: boolean },
) {
  const numericZoneId = zoneId ? Number(zoneId) : 0;
  const isEnabled = (options?.enabled ?? true) && numericZoneId > 0;

  return useQuery<FarmZoneHarvestChartResponse>({
    queryKey: [
      "farm",
      "production-zones",
      numericZoneId,
      "harvest-chart",
      params,
    ],
    queryFn: () => productionZoneHarvestApi.getChart(numericZoneId, params),
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000,
  });
}
