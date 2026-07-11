import { useLocation, useRoute } from "wouter";
import { useMemo } from "react";
import { getMapCenter } from "../utils/map";
import { useAreaById } from "@/features/farm/hooks/useAreas";
import type { CoordinatePoint } from "@/features/farm";

export function useAreaDetailPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/area-distribution/detail/:id");

  const id = match && params?.id ? Number(params.id) : null;
  const { data: area, isLoading } = useAreaById(id!, { enabled: !!id });

  // Map boundary to coordinates for map display
  const coordinates = useMemo(() => {
    return (
      area?.boundary?.map((p: CoordinatePoint) => ({
        lat: p.latitude || 0,
        lng: p.longitude || 0,
      })) || []
    );
  }, [area?.boundary]);

  const navigateToDetail = (id: number) => {
    setLocation(`/plot-distribution/detail/${id}`);
  };

  const center = useMemo(() => {
    if (
      area?.centerPoint?.latitude !== undefined &&
      area?.centerPoint?.longitude !== undefined
    ) {
      return [area.centerPoint.latitude, area.centerPoint.longitude] as [
        number,
        number,
      ];
    }
    return getMapCenter(coordinates);
  }, [area, coordinates]);

  return {
    setLocation,
    area,
    navigateToDetail,
    region: area?.region,
    center,
    landTypeName: area?.soilType?.name || "-",
    terrainName: area?.terrainFeature?.name || "-",
    coordinates,
    isLoading,
  };
}
