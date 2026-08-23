import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";

import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useRegionById } from "@/features/farm/hooks/useRegions";
import { useRegionMutations } from "@/features/farm/hooks/useRegionMutations";
import type {
  FarmRegionRequest,
  FarmRegionResponse,
} from "@/features/farm/types/farm.type";
import type { RegionBasicFormValues } from "../../region-basic-distribution/data/region-basic-form.schema";

type RegionCropSource = {
  id?: number;
  cropId?: number;
  crop?: { id?: number };
  productionSubjectId?: number;
  productionSubject?: { id?: number };
};

export function useRegionBasicAquacultureCreateForm(
  reset: (values: Partial<RegionBasicFormValues>) => void,
) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [match, params] = useRoute(
    "/cultivation-region-identification/aquaculture/edit/:id",
  );
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
        const cropSources: RegionCropSource[] =
          (
            regionDataResponse as FarmRegionResponse & {
              productionSubjects?: RegionCropSource[];
            }
          ).productionSubjects ||
          regionDataResponse.crops ||
          [];

        reset({
          id: regionDataResponse.id,
          code: regionDataResponse.code,
          name: regionDataResponse.name || "",
          cropIds: cropSources
            .map((c) =>
              (
                c.cropId ||
                c.crop?.id ||
                c.productionSubjectId ||
                c.productionSubject?.id ||
                c.id ||
                0
              ).toString(),
            )
            .filter((id) => id !== "0"),
          area: regionDataResponse.acreage || undefined,
          provinceId: regionDataResponse.province || "",
          wardId: regionDataResponse.ward || regionDataResponse.district || "",
          address: regionDataResponse.address || "",
          landType: regionDataResponse.soilType?.id?.toString() || "",
          terrain: regionDataResponse.terrainFeature?.id?.toString() || "",
          note: regionDataResponse.description || "",
          centerPoint: regionDataResponse.centerPoint
            ? {
                lat: regionDataResponse.centerPoint.latitude || undefined,
                lng: regionDataResponse.centerPoint.longitude || undefined,
              }
            : {
                lat: 11.54,
                lng: 106.895,
              },
          metadataJson: {
            address: (regionDataResponse.metadataJson?.address as string) || "",
          },
          isDetailed: false,
          status:
            (regionDataResponse.status as "active" | "inactive" | "archived") ??
            "active",
        });
        setHasInitialized(true);
      }
    } else {
      reset({
        code: "",
        name: "",
        cropIds: [],
        area: undefined,
        provinceId: "",
        wardId: "",
        address: "",
        landType: "",
        terrain: "",
        note: "",
        centerPoint: {
          lat: 11.54,
          lng: 106.895,
        },
        metadataJson: {
          address: "",
        },
        isDetailed: false,
        status: "active",
      });
      setHasInitialized(true);
    }
  }, [hasInitialized, isEditMode, regionDataResponse, reset]);

  const handleComplete = async (data: RegionBasicFormValues) => {
    setIsSubmitting(true);
    try {
      const regionRequest: FarmRegionRequest = {
        code: data.code || undefined,
        name: data.name,
        acreage: data.area,
        province: data.provinceId || "",
        district: data.wardId || "",
        ward: data.wardId || "",
        address: data.address || "",
        soilTypeId: data.landType ? parseInt(data.landType, 10) : undefined,
        terrainFeatureId: data.terrain ? parseInt(data.terrain, 10) : undefined,
        description: data.note || "",
        status: data.status,
        metadataJson: {
          address: data.metadataJson?.address,
          formType: "basic",
        },
        crops: data.cropIds?.length
          ? data.cropIds.map((id) => ({
              cropId: parseInt(id, 10),
              role: "MAIN",
            }))
          : undefined,
        domainCode: "AQUACULTURE",
      };

      if (isEditMode && regionId > 0) {
        await updateRegion.mutateAsync({ id: regionId, data: regionRequest });
        toast({
          title: "Thành công",
          description: "Cập nhật vùng nuôi trồng thuỷ sản thành công",
        });
      } else {
        await createRegion.mutateAsync(regionRequest);
        toast({
          title: "Thành công",
          description: "Đã tạo mới vùng nuôi trồng thuỷ sản thành công",
        });
      }
      setLocation("/cultivation-region-identification/aquaculture");
    } catch (error) {
      console.error("Error saving basic region:", error);
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
    setLocation("/cultivation-region-identification/aquaculture");
  };

  return {
    isEditMode,
    handleComplete,
    handleCancel,
    isSubmitting,
  };
}
