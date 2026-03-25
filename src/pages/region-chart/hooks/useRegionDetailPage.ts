import { useLocation, useRoute } from "wouter";
import useRegionStore from "../../../stores/useRegionStore";
import { getBoundsFromCoordinates, getMapCenter } from "../utils/map";
import {
  getDistrictName,
  getEnterpriseName,
  getLandTypeName,
  getProvinceName,
  getTerrainTypeName,
} from "../utils/lookups";

export function useRegionDetailPage() {
  const [, setLocation] = useLocation();
  const { getRegionById } = useRegionStore();
  const [match, params] = useRoute("/region-distribution/detail/:id");

  const regionId = match && params?.id ? parseInt(params.id, 10) : null;
  const region = regionId ? getRegionById(regionId) : undefined;
  const bounds = getBoundsFromCoordinates(region?.coordinates);
  const center = getMapCenter(region?.coordinates);

  return {
    setLocation,
    region,
    center,
    bounds,
    provinceName: region ? getProvinceName(region.provinceId) : "",
    districtName: region ? getDistrictName(region.districtId) : "",
    enterpriseName: region ? getEnterpriseName(region.enterpriseId) : "",
    landTypeName: region ? getLandTypeName(region.landType) : "",
    terrainName: region ? getTerrainTypeName(region.terrain) : "",
  };
}
