import { useLocation, useRoute } from "wouter";
import { usePlotById } from "@/features/farm/hooks/usePlots";
import { useAreaById } from "@/features/farm/hooks/useAreas";
import { getMapCenter } from "../utils/map";
import { useMemo } from "react";

export function usePlotDetailPage() {
  const [, setLocation] = useLocation();
  const [newMatch, newParams] = useRoute(
    "/plot-distribution/detail/:id",
  );
  const [legacyMatch, legacyParams] = useRoute(
    "/region-chart/plot-distribution/detail/:id",
  );

  const rawId =
    (newMatch && newParams?.id ? String(newParams.id) : null) ||
    (legacyMatch && legacyParams?.id ? String(legacyParams.id) : null);
  const id = rawId ? parseInt(rawId, 10) : 0;

  const { data: plotData, isLoading: isLoadingPlot } = usePlotById(id, {
    enabled: id > 0,
  });

  const areaId = plotData?.area?.id || 0;
  const { data: areaData, isLoading: isLoadingArea } = useAreaById(areaId, {
    enabled: areaId > 0,
  });

  const plotCoordinates = useMemo(() => {
    return (plotData?.boundary || []).map((b) => ({
      lat: b.latitude || 0,
      lng: b.longitude || 0,
    }));
  }, [plotData]);

  const areaCoordinates = useMemo(() => {
    return (areaData?.boundary || []).map((b) => ({
      lat: b.latitude || 0,
      lng: b.longitude || 0,
    }));
  }, [areaData]);

  return {
    setLocation,
    plot: plotData
      ? {
          id: String(plotData.id),
          name: plotData.name || "",
          area: plotData.acreage,
          altitude: plotData.elevation,
          contour: plotData.contourInterval ? `${plotData.contourInterval}m` : "—",
          coordinates: plotCoordinates,
        }
      : null,
    area: areaData
      ? {
          name: areaData.name || "",
          coordinates: areaCoordinates,
        }
      : null,
    region: plotData?.area?.region
      ? {
          name: plotData.area.region.name || "",
        }
      : null,
    center: getMapCenter(
      plotCoordinates.length ? plotCoordinates : areaCoordinates,
    ),
    isLoading: isLoadingPlot || isLoadingArea,
  };
}
