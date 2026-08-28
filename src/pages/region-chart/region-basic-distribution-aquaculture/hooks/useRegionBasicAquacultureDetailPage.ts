import { useMemo } from "react";
import { useLocation, useRoute } from "wouter";

import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import { useCultivationZoneById } from "@/features/farm/hooks/useCultivationZones";
import { useRegionById } from "@/features/farm/hooks/useRegions";
import { useAddressOptions } from "@/features/master-data/hooks/useAddressOptions";

export function useRegionBasicAquacultureDetailPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/cultivation-region-identification/aquaculture/detail/:id");
  // Route id is the Cultivation Zone ID (same convention as the edit page).
  const zoneId = match && params?.id ? parseInt(params.id, 10) : null;

  const { data: zoneData, isLoading: isZoneLoading } = useCultivationZoneById(
    zoneId || 0,
    { enabled: !!zoneId },
  );

  const regionId = useMemo(() => {
    if (!zoneData) return 0;
    const regionScope = zoneData.scopes?.find((s) => s.scopeType === "REGION");
    // @ts-ignore
    return regionScope?.region?.id || regionScope?.scopeId || 0;
  }, [zoneData]);

  const { data: regionDataResponse, isLoading: isRegionLoading } = useRegionById(
    regionId,
    { enabled: regionId > 0 },
  );

  const isLoading = isZoneLoading || (regionId > 0 && isRegionLoading);

  const { provinces, wards } = useAddressOptions(regionDataResponse?.province);
  const { items: lands } = useCatalog("soil-types");
  const { items: terrains } = useCatalog("terrain-features");

  const region = useMemo(() => {
    if (!zoneData) return undefined;

    return {
      id: zoneId || 0,
      code: regionDataResponse?.code || zoneData.code || "",
      name: regionDataResponse?.name || zoneData.name || "",
      area:
        regionDataResponse?.acreage ||
        (zoneData.metadataJson?.area as number) ||
        0,
      provinceId: regionDataResponse?.province || "",
      wardId: regionDataResponse?.ward || regionDataResponse?.district || "",
      address:
        regionDataResponse?.address ||
        (zoneData.metadataJson?.address as string) ||
        "",
      landType: regionDataResponse?.soilType?.id?.toString() || "",
      terrain: regionDataResponse?.terrainFeature?.id?.toString() || "",
      note: regionDataResponse?.description || zoneData.notes || "",
      status: regionDataResponse?.status ?? zoneData.status ?? "inactive",
      createdAt: regionDataResponse?.createdAt || zoneData.createdAt || "",
      updatedAt: regionDataResponse?.updatedAt || "",
    };
  }, [zoneData, zoneId, regionDataResponse]);

  const provinceName =
    provinces.find((item) => item.code === region?.provinceId)?.name ||
    region?.provinceId ||
    "";
  const wardName =
    wards.find((item) => item.code === region?.wardId)?.name ||
    region?.wardId ||
    "";
  const landTypeName =
    lands.find((item) => String(item.id || item.code) === region?.landType)
      ?.name || region?.landType || "";
  const terrainName =
    terrains.find((item) => String(item.id || item.code) === region?.terrain)
      ?.name || region?.terrain || "";

  return {
    setLocation,
    region,
    isLoading,
    provinceName,
    wardName,
    landTypeName,
    terrainName,
  };
}
