import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { AreaFormValues } from "../data/area-form.schema";
import { useAreaMutations } from "@/features/farm/hooks/useAreaMutations";
import { useAreaById } from "@/features/farm/hooks/useAreas";
import type { FarmAreaRequest } from "@/features/farm/types/farm.type";

export function useAreaCreateForm(
  reset: (values: Partial<AreaFormValues>) => void,
) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [match, params] = useRoute("/area-distribution/edit/:id");
  const isEditMode = match && !!params?.id;
  const areaId = parseInt(params?.id || "0", 10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [hasInitialized, setHasInitialized] = useState(false);

  const { data: areaDataResponse } = useAreaById(areaId, {
    enabled: isEditMode && areaId > 0,
  });

  const { createArea, updateArea } = useAreaMutations();

  useEffect(() => {
    if (hasInitialized) return;

    if (isEditMode) {
      if (areaDataResponse) {
        const isDetailed = (areaDataResponse.boundary || []).length >= 3;
        reset({
          isDetailed,
          id: areaDataResponse.id,
          code: areaDataResponse.code,
          name: areaDataResponse.name || "",
          metadataJson: {
            address: (areaDataResponse.metadataJson?.address as string) || "",
          },
          enterpriseId:
            (areaDataResponse.metadataJson?.enterpriseId as string) || "",
          regionId: areaDataResponse.region?.id,
          acreage: areaDataResponse.acreage || undefined,
          soilType: areaDataResponse.soilType?.id?.toString() || "",
          terrainFeature: areaDataResponse.terrainFeature?.id?.toString() || "",
          // @ts-expect-error status type mismatch
          status: areaDataResponse.status ?? "active",
          coordinates: (areaDataResponse.boundary || []).map((b) => ({
            lat: b.latitude || 0,
            lng: b.longitude || 0,
          })),
          centerPoint: areaDataResponse.centerPoint
            ? {
                lat: areaDataResponse.centerPoint.latitude || 0,
                lng: areaDataResponse.centerPoint.longitude || 0,
              }
            : undefined,
          plots: (areaDataResponse.plots || []).map((plot) => ({
            id: plot.id?.toString(),
            code: plot.code || "",
            name: plot.name || "",
            acreage: plot.acreage || 0,
            elevation: plot.elevation,
            contourInterval: plot.contourInterval,
            coordinates: (plot.boundary || []).map((b) => ({
              lat: b.latitude || 0,
              lng: b.longitude || 0,
            })),
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
        regionId: undefined,
        acreage: undefined,
        soilType: "",
        terrainFeature: "",
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
        plots: [],
        status: "active",
      });
      setHasInitialized(true);
    }
  }, [isEditMode, areaDataResponse, reset, hasInitialized]);

  const handleComplete = async (data: AreaFormValues) => {
    setIsSubmitting(true);
    try {
      const areaRequest: FarmAreaRequest = {
        code: data.code,
        name: data.name,
        acreage: data.acreage,
        regionId: data.regionId,
        soilTypeId: data.soilType ? parseInt(data.soilType, 10) : undefined,
        terrainFeatureId: data.terrainFeature
          ? parseInt(data.terrainFeature, 10)
          : undefined,
        status: data.status ?? "active",
        metadataJson: {
          enterpriseId: data.enterpriseId,
          address: data.metadataJson?.address,
        },
        boundary: data.isDetailed
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
        plots: data.isDetailed
          ? (data.plots || []).map((sub) => {
              const plotId =
                sub.id &&
                typeof sub.id === "string" &&
                sub.id.startsWith("sub-")
                  ? undefined
                  : sub.id
                    ? Number(sub.id)
                    : undefined;
              return {
                id: plotId,
                code: sub.code,
                name: sub.name,
                acreage: sub.acreage,
                elevation:
                  sub.elevation !== undefined
                    ? Number(sub.elevation)
                    : undefined,
                contourInterval:
                  sub.contourInterval !== undefined
                    ? Number(sub.contourInterval)
                    : undefined,
                metadataJson: {
                  enterpriseId: data.enterpriseId,
                },
                boundary: (sub.coordinates || []).map((c) => ({
                  latitude: c.lat,
                  longitude: c.lng,
                })),
              };
            })
          : undefined,
      };

      if (isEditMode && areaId > 0) {
        await updateArea.mutateAsync({ id: areaId, data: areaRequest });
        toast({
          title: "Thành công",
          description: "Cập nhật khu vực thành công",
        });
      } else {
        await createArea.mutateAsync({
          regionId: data.regionId,
          data: areaRequest,
        });
        toast({
          title: "Thành công",
          description: "Đã tạo mới khu vực thành công",
        });
      }
      setLocation("/area-distribution");
    } catch (error) {
      console.error("Error saving area:", error);
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
    setLocation("/area-distribution");
  };

  return {
    handleComplete,
    handleCancel,
    isSubmitting,
    isEditMode,
  };
}
