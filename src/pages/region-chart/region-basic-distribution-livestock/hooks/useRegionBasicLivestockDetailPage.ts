import { useMemo } from "react";
import { useLocation, useRoute } from "wouter";

import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import { useRegionById } from "@/features/farm/hooks/useRegions";
import { useAddressOptions } from "@/features/master-data/hooks/useAddressOptions";

export function useRegionBasicLivestockDetailPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/cultivation-region-identification/animal/detail/:id");
  const regionId = match && params?.id ? parseInt(params.id, 10) : null;

  const { data: regionDataResponse, isLoading } = useRegionById(regionId || 0, {
    enabled: !!regionId,
  });

  const { provinces, wards } = useAddressOptions(regionDataResponse?.province);
  const { items: lands } = useCatalog("soil-types");
  const { items: terrains } = useCatalog("terrain-features");

  const region = useMemo(() => {
    if (!regionDataResponse) return undefined;

    return {
      id: regionDataResponse.id,
      code: regionDataResponse.code || "",
      name: regionDataResponse.name || "",
      area: regionDataResponse.acreage || 0,
      provinceId: regionDataResponse.province || "",
      wardId: regionDataResponse.ward || regionDataResponse.district || "",
      address: regionDataResponse.address || "",
      landType: regionDataResponse.soilType?.id?.toString() || "",
      terrain: regionDataResponse.terrainFeature?.id?.toString() || "",
      note: regionDataResponse.description || "",
      status: regionDataResponse.status ?? "inactive",
      createdAt: regionDataResponse.createdAt || "",
      updatedAt: regionDataResponse.updatedAt || "",
    };
  }, [regionDataResponse]);

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
