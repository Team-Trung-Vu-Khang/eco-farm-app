import { useLocation, useRoute } from "wouter";
import useLandStore from "@/stores/useLandStore";
import useTerrainStore from "@/stores/useTerrainStore";
import useRegionStore from "../../../stores/useRegionStore";
import { getMapCenter } from "../utils/map";

export function useAreaDetailPage() {
  const [, setLocation] = useLocation();
  const lands = useLandStore((state) => state.lands);
  const terrains = useTerrainStore((state) => state.terrains);
  const [match, params] = useRoute("/area-distribution/detail/:id");
  const { getAreaById, regions } = useRegionStore();

  const id = match && params?.id ? String(params.id) : null;
  const areaContext = id ? getAreaById(id) : null;
  const area = areaContext?.area ?? null;
  const region =
    area &&
    regions.find(
      (item) => item.id === area.regionId || item.code === area.regionId,
    );

  return {
    setLocation,
    area,
    region,
    center: getMapCenter(area?.coordinates),
    landTypeName:
      lands.find((land) => land.code === area?.landType)?.name || area?.landType || "",
    terrainName:
      terrains.find((terrain) => terrain.code === area?.terrain)?.name || area?.terrain || "",
  };
}
