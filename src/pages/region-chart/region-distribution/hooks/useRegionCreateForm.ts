import { useRegionMutations } from "@/features/farm/hooks/useRegionMutations";
import { useRegionById } from "@/features/farm/hooks/useRegions";
import type { FarmRegionRequest } from "@/features/farm/types/farm.type";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import type { RegionFormValues } from "../data/region-form.schema";

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

  const { createRegion, updateRegion } = useRegionMutations();

  useEffect(() => {
    if (hasInitialized) return;

    if (isEditMode) {
      if (regionDataResponse) {
        const isDetailed = (regionDataResponse.boundary || []).length >= 3;
        reset({
          isDetailed,
          id: regionDataResponse.id,
          code: regionDataResponse.code,
          name: regionDataResponse.name,
          metadataJson: {
            address: (regionDataResponse.metadataJson?.address as string) || "",
          },
          enterpriseId:
            (regionDataResponse.metadataJson?.enterpriseId as string) || "",
          area: regionDataResponse.acreage || undefined,
          provinceId: regionDataResponse.province || "",
          wardId: regionDataResponse.ward || regionDataResponse.district || "",
          address: regionDataResponse.address || "",
          cropIds:
            (regionDataResponse.crops
              ?.filter((c) => c.role === "MAIN")
              .map((c) => (c.cropId || c.crop?.id)?.toString())
              .filter(Boolean) as string[]) || [],
          landType: regionDataResponse.soilType?.id?.toString() || "",
          terrain: regionDataResponse.terrainFeature?.id?.toString() || "",
          note: regionDataResponse.description || "",
          // @ts-expect-error status type mismatch
          status: regionDataResponse.status ?? "active",
          coordinates: (regionDataResponse.boundary || []).map((b) => ({
            lat: b.latitude || 0,
            lng: b.longitude || 0,
          })),
          centerPoint: regionDataResponse.centerPoint
            ? {
                lat: regionDataResponse.centerPoint.latitude || 0,
                lng: regionDataResponse.centerPoint.longitude || 0,
              }
            : undefined,
          // @ts-expect-error subAreas type mismatch
          subAreas: (regionDataResponse.areas || []).map((area) => ({
            id: area.id?.toString(),
            code: area.code,
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasInitialized(true);
      }
    } else {
      reset({
        isDetailed: true,
        name: "",
        enterpriseId: "",
        metadataJson: {
          address: "",
        },
        area: undefined,
        provinceId: "",
        wardId: "",
        address: "",
        cropIds: [],
        landType: "",
        terrain: "",
        note: "",
        coordinates: [
          { lat: 11.53, lng: 106.88 },
          { lat: 11.55, lng: 106.88 },
          { lat: 11.55, lng: 106.91 },
          { lat: 11.53, lng: 106.91 },
        ],
        centerPoint: {
          lat: 11.54,
          lng: 106.895,
        },
        subAreas: [],
        status: "active",
      });
      setHasInitialized(true);
    }
  }, [isEditMode, regionDataResponse, reset, hasInitialized]);

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
          address: data.metadataJson?.address,
        },
        crops: data.cropIds?.length
          ? data.cropIds.map((id) => ({
              cropId: parseInt(id, 10),
              role: "MAIN",
            }))
          : undefined,
        boundary: data.coordinates?.length
          ? (data.coordinates || []).map((c) => ({
              latitude: c.lat,
              longitude: c.lng,
            }))
          : undefined,
        centerPoint: data.centerPoint
          ? {
              latitude: data.centerPoint.lat,
              longitude: data.centerPoint.lng,
            }
          : undefined,
        areas: data.subAreas?.length
          ? (data.subAreas || []).map((sub) => ({
              id: sub.id ? parseInt(sub.id, 10) : undefined,
              code: sub.code,
              name: sub.name,
              acreage: sub.area,
              soilTypeId: sub.landType ? parseInt(sub.landType, 10) : undefined,
              terrainFeatureId: sub.terrain
                ? parseInt(sub.terrain, 10)
                : undefined,
              status: sub.status,
              metadataJson: {
                enterpriseId: data.enterpriseId,
              },
              boundary: (sub.coordinates || []).map((c) => ({
                latitude: c.lat,
                longitude: c.lng,
              })),
            }))
          : undefined,
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
      console.error("Error saving region:", error);
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
