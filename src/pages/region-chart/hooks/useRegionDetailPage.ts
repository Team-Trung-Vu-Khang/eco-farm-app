import { useLocation, useRoute } from "wouter";
import { getBoundsFromCoordinates, getMapCenter } from "../utils/map";
import { useRegionById } from "@/features/farm/hooks/useRegions";
import { useAddressOptions } from "@/features/master-data/hooks/useAddressOptions";
import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import { useOrganizationById } from "@/features/organization/hooks/useOrganizationById";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { useMemo } from "react";
import type { Region } from "../constants";

export function useRegionDetailPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/region-distribution/detail/:id");
  const regionId = match && params?.id ? parseInt(params.id, 10) : null;

  const { data: regionDataResponse, isLoading } = useRegionById(regionId || 0, {
    enabled: !!regionId,
  });

  const region: Region | undefined = useMemo(() => {
    if (!regionDataResponse) return undefined;
    return {
      id: regionDataResponse.id,
      code: regionDataResponse.code || "",
      name: regionDataResponse.name || "",
      provinceId: regionDataResponse.province || "",
      districtId: regionDataResponse.district || "",
      ward: regionDataResponse.ward || "",
      address: regionDataResponse.address || "",
      enterpriseId:
        (regionDataResponse.metadataJson?.enterpriseId as string) || "",
      area: regionDataResponse.acreage || 0,
      landType: regionDataResponse.soilType?.id?.toString() || "",
      terrain: regionDataResponse.terrainFeature?.id?.toString() || "",
      note: regionDataResponse.description || "",
      status: regionDataResponse.status ?? "inactive",
      coordinates: (regionDataResponse.boundary || []).map((b) => ({
        lat: b.latitude || 0,
        lng: b.longitude || 0,
      })),
      subAreas: (regionDataResponse.areas || []).map((a) => ({
        id: a.id?.toString() || "",
        code: a.code || "",
        name: a.name || "",
        regionId: regionDataResponse.id,
        area: a.acreage || 0,
        landType: a.soilType?.id?.toString() || "",
        terrain: a.terrainFeature?.id?.toString() || "",
        coordinates: (a.boundary || []).map((b) => ({
          lat: b.latitude || 0,
          lng: b.longitude || 0,
        })),
        plots: [],
        createdAt: a.createdAt || "",
        status: a?.status ?? "inactive",
      })),
      createdAt: regionDataResponse.createdAt || "",
    };
  }, [regionDataResponse]);

  const bounds = getBoundsFromCoordinates(region?.coordinates);
  const center = getMapCenter(region?.coordinates);

  const { provinces, wards } = useAddressOptions(region?.provinceId);
  const { items: lands } = useCatalog("soil-types");
  const { items: terrains } = useCatalog("terrain-features");

  const workspaceId = useSelectedWorkspaceId();
  const parsedWorkspaceId =
    typeof workspaceId === "number" ? workspaceId : undefined;
  const { item: selectedOrganization } = useOrganizationById(
    region?.enterpriseId || "",
    parsedWorkspaceId ?? "missing",
    {
      enabled: parsedWorkspaceId !== undefined && !!region?.enterpriseId,
    },
  );

  const navigateToDetail = (id: string) => {
    setLocation(`/area-distribution/detail/${id}`);
  };

  return {
    setLocation,
    region,
    isLoading,
    center,
    bounds,
    navigateToDetail,
    provinceName:
      provinces.find((p) => p.code === region?.provinceId)?.name ||
      region?.provinceId ||
      "",
    districtName:
      wards.find(
        (w) =>
          w.code === (regionDataResponse?.ward || regionDataResponse?.district),
      )?.name ||
      regionDataResponse?.ward ||
      regionDataResponse?.district ||
      "",
    enterpriseName: selectedOrganization?.name || region?.enterpriseId || "",
    landTypeName:
      lands.find((l) => String(l.id || l.code) === region?.landType)?.name ||
      region?.landType ||
      "",
    terrainName:
      terrains.find((t) => String(t.id || t.code) === region?.terrain)?.name ||
      region?.terrain ||
      "",
  };
}
