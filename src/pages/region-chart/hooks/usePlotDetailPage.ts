import { useLocation, useRoute } from "wouter";
import useRegionStore from "../../../stores/useRegionStore";
import { getMapCenter } from "../utils/map";

export function usePlotDetailPage() {
  const [, setLocation] = useLocation();
  const [newMatch, newParams] = useRoute(
    "/region-chart/plot-distribution/detail/:id",
  );
  const [legacyMatch, legacyParams] = useRoute("/plot-distribution/detail/:id");
  const { getPlotById } = useRegionStore();

  const id =
    (newMatch && newParams?.id ? String(newParams.id) : null) ||
    (legacyMatch && legacyParams?.id ? String(legacyParams.id) : null);
  const context = id ? getPlotById(id) : null;
  const plot = context?.plot ?? null;
  const area = context?.area ?? null;
  const region = context?.region ?? null;

  return {
    setLocation,
    plot,
    area,
    region,
    center: getMapCenter(plot?.coordinates?.length ? plot.coordinates : area?.coordinates),
  };
}
