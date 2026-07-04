import { useLocation, useRoute } from "wouter";
import { getMapCenter } from "../utils/map";
import { useAreaById } from "@/features/farm/hooks/useAreas";

export function useAreaDetailPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/area-distribution/detail/:id");

  const id = match && params?.id ? Number(params.id) : null;
  const { data: area, isLoading } = useAreaById(id!, { enabled: !!id });

  // Map boundary to coordinates for map display
  const coordinates =
    area?.boundary?.map((p: any) => ({
      lat: p.latitude,
      lng: p.longitude,
    })) || [];

  const navigateToDetail = (id: number) => {
    setLocation(`/plot-distribution/detail/${id}`);
  };

  return {
    setLocation,
    area,
    navigateToDetail,
    region: area?.region,
    center: getMapCenter(coordinates),
    landTypeName: area?.soilType?.name || "-",
    terrainName: area?.terrainFeature?.name || "-",
    coordinates,
    isLoading,
  };
}
