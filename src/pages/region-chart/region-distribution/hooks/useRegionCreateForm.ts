import { useCallback, useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { RegionFormValues } from "../data/region-form.schema";
import { useRegionMutations } from "@/features/farm/hooks/useRegionMutations";
import { useRegionById, useRegions } from "@/features/farm/hooks/useRegions";
import type { FarmRegionRequest } from "@/features/farm/types/farm.type";

export function useRegionCreateForm(
  reset: (values: Partial<RegionFormValues>) => void,
) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [match, params] = useRoute("/region-distribution/edit/:id");
  const isEditMode = match && !!params?.id;
  const regionId = parseInt(params?.id || "0", 10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [hasInitialized, setHasInitialized] = useState(false);

  const { data: regionDataResponse } = useRegionById(regionId, {
    enabled: isEditMode && regionId > 0,
  });

  const { items: regions, loading: regionsLoading } = useRegions({
    params: { size: 100 },
  });

  const { createRegion, updateRegion } = useRegionMutations();

  const generateNextRegionCode = useCallback(() => {
    const maxCodeNumber = regions.reduce((max, region) => {
      const match = /^REG-(\d+)$/i.exec(region.code || "");
      if (!match) return max;
      const current = Number(match[1]);
      return Number.isNaN(current) ? max : Math.max(max, current);
    }, 0);

    return `REG-${String(maxCodeNumber + 1).padStart(3, "0")}`;
  }, [regions]);

  useEffect(() => {
    if (hasInitialized) return;

    if (isEditMode) {
      if (regionDataResponse) {
        reset({
          id: regionDataResponse.id,
          code: regionDataResponse.code,
          name: regionDataResponse.name,
          enterpriseId:
            (regionDataResponse.metadataJson?.enterpriseId as string) || "",
          area: regionDataResponse.acreage || undefined,
          provinceId: regionDataResponse.province || "",
          wardId: regionDataResponse.ward || regionDataResponse.district || "",
          address: regionDataResponse.address || "",
          cropId:
            regionDataResponse.crops
              ?.find((c) => c.role === "MAIN")
              ?.cropId?.toString() ||
            regionDataResponse.crops
              ?.find((c) => c.role === "MAIN")
              ?.crop?.id?.toString() ||
            "",
          landType: regionDataResponse.soilType?.id?.toString() || "",
          terrain: regionDataResponse.terrainFeature?.id?.toString() || "",
          note: regionDataResponse.description || "",
          // @ts-ignore
          status: regionDataResponse.status ?? "active",
          coordinates: (regionDataResponse.boundary || []).map((b) => ({
            lat: b.latitude || 0,
            lng: b.longitude || 0,
          })),
          // @ts-ignore
          subAreas: (regionDataResponse.areas || []).map((area) => ({
            id: area.id?.toString(),
            code: area.code || "",
            name: area.name || "",
            area: area.acreage || 0,
            landType: area.soilType?.id?.toString() || "",
            terrain: area.terrainFeature?.id?.toString() || "",
            coordinates: (area.boundary || []).map((b) => ({
              lat: b.latitude || 0,
              lng: b.longitude || 0,
            })),
            status: area.status ?? "active",
          })),
        });
        setHasInitialized(true);
      }
    } else {
      if (!regionsLoading) {
        reset({
          code: generateNextRegionCode(),
          name: "",
          enterpriseId: "",
          area: undefined,
          provinceId: "",
          wardId: "",
          address: "",
          cropId: "",
          landType: "",
          terrain: "",
          note: "",
          coordinates: [
            { lat: 11.53, lng: 106.88 },
            { lat: 11.55, lng: 106.88 },
            { lat: 11.55, lng: 106.91 },
            { lat: 11.53, lng: 106.91 },
          ],
          subAreas: [],
          status: "active",
        });
        setHasInitialized(true);
      }
    }
  }, [
    isEditMode,
    regionDataResponse,
    generateNextRegionCode,
    reset,
    hasInitialized,
    regionsLoading,
  ]);

  const handleComplete = async (data: RegionFormValues) => {
    setIsSubmitting(true);
    try {
      const regionRequest: FarmRegionRequest = {
        code: data.code,
        name: data.name,
        acreage: data.area,
        province: data.provinceId || "",
        district: data.wardId || "", // Store ward as district in backend
        ward: data.wardId || "",
        address: data.address || "",
        soilTypeId: data.landType ? parseInt(data.landType, 10) : undefined,
        terrainFeatureId: data.terrain ? parseInt(data.terrain, 10) : undefined,
        description: data.note || "",
        status: data.status,
        metadataJson: {
          enterpriseId: data.enterpriseId,
        },
        crops: data.cropId
          ? [{ cropId: parseInt(data.cropId, 10), role: "MAIN" }]
          : undefined,
        boundary: (data.coordinates || []).map((c) => ({
          latitude: c.lat,
          longitude: c.lng,
        })),
        areas: (data.subAreas || []).map((sub) => ({
          id: sub.id ? parseInt(sub.id, 10) : undefined,
          code: sub.code,
          name: sub.name,
          acreage: sub.area,
          soilTypeId: sub.landType ? parseInt(sub.landType, 10) : undefined,
          terrainFeatureId: sub.terrain ? parseInt(sub.terrain, 10) : undefined,
          status: sub.status,
          metadataJson: {
            enterpriseId: data.enterpriseId,
          },
          boundary: (sub.coordinates || []).map((c) => ({
            latitude: c.lat,
            longitude: c.lng,
          })),
        })),
      };

      if (isEditMode && regionId > 0) {
        await updateRegion.mutateAsync({ id: regionId, data: regionRequest });
        toast({
          title: "Thành công",
          description: "Cập nhật vùng trồng thành công",
        });
      } else {
        await createRegion.mutateAsync(regionRequest);
        toast({
          title: "Thành công",
          description: "Đã tạo mới vùng trồng thành công",
        });
      }
      setLocation("/region-distribution");
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi lưu thông tin",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setLocation("/region-distribution");
  };

  return {
    handleComplete,
    handleCancel,
    isSubmitting,
    isEditMode,
  };
}
