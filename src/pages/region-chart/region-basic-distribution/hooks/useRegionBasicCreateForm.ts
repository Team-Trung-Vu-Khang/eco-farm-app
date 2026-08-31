import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";

import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useRegionById } from "@/features/farm/hooks/useRegions";
import { useRegionMutations } from "@/features/farm/hooks/useRegionMutations";
import type {
  FarmRegionRequest,
  FarmRegionResponse,
} from "@/features/farm/types/farm.type";

import type { RegionBasicFormValues } from "../data/region-basic-form.schema";

import { useCultivationZoneById } from "@/features/farm/hooks/useCultivationZones";
import { useCultivationZoneMutations } from "@/features/farm/hooks/useCultivationZoneMutations";
import type { FarmCultivationZoneRequest } from "@/features/farm/types/farm.type";
import { useMemo } from "react";

type RegionCropSource = {
  id?: number;
  cropId?: number;
  crop?: { id?: number };
  productionSubjectId?: number;
  productionSubject?: { id?: number };
};

export function useRegionBasicCreateForm(
  reset: (values: Partial<RegionBasicFormValues>) => void,
) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [matchBasic, paramsBasic] = useRoute(
    "/cultivation-region-identification/crop/edit/:id",
  );
  const [matchDetailed, paramsDetailed] = useRoute(
    "/cultivation-region/:id/edit",
  );
  const isEditMode =
    (matchBasic && !!paramsBasic?.id) ||
    (matchDetailed && !!paramsDetailed?.id);
  // Both routes now pass Zone ID
  const zoneId = parseInt(paramsBasic?.id || paramsDetailed?.id || "0", 10);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // 1. Fetch Zone detail by ID
  const { data: zoneData } = useCultivationZoneById(zoneId, {
    enabled: isEditMode && zoneId > 0,
  });

  // 2. Resolve regionId from zone scopes
  const regionId = useMemo(() => {
    if (!zoneData) return 0;
    const regionScope = zoneData.scopes?.find((s) => s.scopeType === "REGION");
    // @ts-expect-error regionScope type structure differs
    return regionScope?.region?.id || regionScope?.scopeId || 0;
  }, [zoneData]);

  // 3. Fetch Region detail by resolved regionId
  const { data: regionDataResponse } = useRegionById(regionId, {
    enabled: isEditMode && regionId > 0,
  });

  const { createRegion, updateRegion } = useRegionMutations();
  const { createCultivationZone, updateCultivationZone } =
    useCultivationZoneMutations();

  useEffect(() => {
    if (hasInitialized) return;

    if (isEditMode) {
      if (zoneData && (!regionId || regionDataResponse)) {
        const cropSources: RegionCropSource[] =
          (
            regionDataResponse as FarmRegionResponse & {
              productionSubjects?: RegionCropSource[];
            }
          )?.productionSubjects ||
          regionDataResponse?.crops ||
          [];

        // Build varietyLabels and varietyCropMap
        const varietyLabels: Record<string, string> = {};
        const varietyCropMap: Record<string, string> = {};

        if (zoneData) {
          (zoneData.productionSubjectVariants ?? []).forEach((v) => {
            if (!v.id) return;
            varietyLabels[String(v.id)] = v.name || "";
            const cId = v.productionSubject?.id || v.crop?.id;
            if (cId) varietyCropMap[String(v.id)] = String(cId);
          });

          (zoneData.subjectVariants ?? []).forEach((s) => {
            const vId = s.cropVariety?.id || s.subjectVariant?.id || s.id;
            if (!vId) return;
            varietyLabels[String(vId)] = s.cropVariety?.name || s.subjectVariant?.name || s.name || "";
            const cId = s.productionSubject?.id || s.crop?.id || s.productionSubjectId;
            if (cId) varietyCropMap[String(vId)] = String(cId);
          });
        }

        reset({
          id: regionDataResponse?.id || undefined,
          code: regionDataResponse?.code,
          name: regionDataResponse?.name || zoneData.name || "",
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
          area:
            regionDataResponse?.acreage ||
            (zoneData.metadataJson?.area as number) ||
            undefined,
          provinceId: regionDataResponse?.province || "",
          wardId:
            regionDataResponse?.ward || regionDataResponse?.district || "",
          address:
            regionDataResponse?.address ||
            (zoneData.metadataJson?.address as string) ||
            "",
          landType: regionDataResponse?.soilType?.id?.toString() || "",
          terrain: regionDataResponse?.terrainFeature?.id?.toString() || "",
          note: regionDataResponse?.description || zoneData.notes || "",
          centerPoint: regionDataResponse?.centerPoint
            ? {
                lat: regionDataResponse.centerPoint.latitude || undefined,
                lng: regionDataResponse.centerPoint.longitude || undefined,
              }
            : {
                lat: 11.54,
                lng: 106.895,
              },
          metadataJson: {
            address:
              (regionDataResponse?.metadataJson?.address as string) ||
              (zoneData.metadataJson?.address as string) ||
              "",
          },
          isDetailed: false,
          status:
            (regionDataResponse?.status as
              | "active"
              | "inactive"
              | "archived") ?? "active",
          farmingMethodId: zoneData?.productionMethod?.id || undefined,
          rearingMethodId: zoneData?.rearingMethod?.id || undefined,
          // subjectVariants = owner seeds; load into seedIds
          seedIds: (zoneData?.subjectVariants ?? []).map((s) => s.id),
          cropSeedToggles:
            (zoneData?.metadataJson?.cropSeedToggles as Record<string, boolean>) || {},
          // varietyIds: prefer productionSubjectVariants (Foundation), fallback subjectVariants
          varietyIds:
            (zoneData?.productionSubjectVariants ?? []).length > 0
              ? (zoneData?.productionSubjectVariants ?? []).map((v) => v.id)
              : (zoneData?.subjectVariants ?? []).map(
                  (s) => s.cropVariety?.id || s.subjectVariant?.id || 0,
                ).filter((id) => id > 0),
          useSpecificSeeds: (zoneData?.subjectVariants ?? []).length > 0,
          varietyLabels,
          varietyCropMap,
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
        farmingMethodId: undefined,
        rearingMethodId: undefined,
        seedIds: [],
        cropSeedToggles: {},
        varietyIds: [],
        useSpecificSeeds: false,
      });
      setHasInitialized(true);
    }
  }, [
    hasInitialized,
    isEditMode,
    regionDataResponse,
    reset,
    zoneData,
    regionId,
  ]);

  const handleComplete = async (data: RegionBasicFormValues) => {
    setIsSubmitting(true);
    try {
      // Build variant payload — mutually exclusive per API spec
      const buildVariantPayload = (useSpecific: boolean, sIds: number[], vIds: number[]) => {
        if (useSpecific) return { subjectVariantIds: sIds };
        return { productionSubjectVariantIds: vIds };
      };

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
        centerPoint:
          data.centerPoint?.lat && data.centerPoint?.lng
            ? {
                latitude: data.centerPoint.lat,
                longitude: data.centerPoint.lng,
              }
            : undefined,
        crops: data.cropIds?.length
          ? data.cropIds.map((id) => ({
              cropId: parseInt(id, 10),
              role: "MAIN",
            }))
          : undefined,
        domainCode: "CROP",
      };

      const regionChanged =
        !isEditMode ||
        !regionDataResponse ||
        regionDataResponse.name !== data.name ||
        regionDataResponse.code !== data.code ||
        regionDataResponse.acreage !== data.area ||
        regionDataResponse.province !== data.provinceId ||
        regionDataResponse.district !== data.wardId ||
        regionDataResponse.ward !== data.wardId ||
        regionDataResponse.address !== data.address ||
        regionDataResponse.soilType?.id !==
          (data.landType ? parseInt(data.landType, 10) : undefined) ||
        regionDataResponse.terrainFeature?.id !==
          (data.terrain ? parseInt(data.terrain, 10) : undefined) ||
        regionDataResponse.description !== data.note ||
        regionDataResponse.status !== data.status ||
        regionDataResponse.centerPoint?.latitude !== data.centerPoint?.lat ||
        regionDataResponse.centerPoint?.longitude !== data.centerPoint?.lng ||
        JSON.stringify(
          (regionDataResponse.crops || [])
            .map((c: RegionCropSource) => (c.cropId || c.crop?.id || 0).toString())
            .sort(),
        ) !== JSON.stringify([...(data.cropIds || [])].sort());

      const zoneChanged =
        !zoneData ||
        zoneData.farmingMethod?.id !== data.farmingMethodId ||
        zoneData.rearingMethod?.id !== data.rearingMethodId ||
        JSON.stringify((zoneData.seeds || []).map((s) => s.id).sort()) !==
          JSON.stringify([...(data.seedIds || [])].map(Number).sort()) ||
        JSON.stringify(zoneData.metadataJson?.cropSeedToggles) !==
          JSON.stringify(data.cropSeedToggles);

      let savedRegionId = regionId;

      if (!isEditMode) {
        // Create Region
        const createdRegion = await createRegion.mutateAsync(regionRequest);
        savedRegionId = createdRegion.id;

        // Create Cultivation Zone
        const zoneRequest: FarmCultivationZoneRequest = {
          name: data.name,
          domainCode: "CROP",
          productionMethodId: data.farmingMethodId || 0,
          rearingMethodId: data.rearingMethodId || undefined,
          ...buildVariantPayload(
            !!data.useSpecificSeeds,
            (data.seedIds ?? []).map(Number).filter(Boolean),
            (data.varietyIds ?? []).filter((id) => id > 0),
          ),
          status: data.status,
          scopes: [
            {
              scopeType: "REGION",
              scopeId: savedRegionId,
            },
          ],
          metadataJson: {
            formType: "basic",
            address: data.address || data.metadataJson?.address || "",
            area: data.area || 0,
          },
        };
        await createCultivationZone.mutateAsync(zoneRequest);

        toast({
          title: "Thành công",
          description: "Đã tạo mới vùng trồng và cấu hình canh tác thành công",
        });
      } else {
        if (regionChanged && regionId > 0) {
          await updateRegion.mutateAsync({ id: regionId, data: regionRequest });
        }

        if (zoneChanged) {
          const zoneRequest: FarmCultivationZoneRequest = {
            name: data.name,
            domainCode: "CROP",
            productionMethodId: data.farmingMethodId || 0,
            rearingMethodId: data.rearingMethodId || undefined,
            ...buildVariantPayload(
              !!data.useSpecificSeeds,
              (data.seedIds ?? []).map(Number).filter(Boolean),
              (data.varietyIds ?? []).filter((id) => id > 0),
            ),
            status: data.status,
            scopes: [
              {
                scopeType: "REGION",
                scopeId: regionId || savedRegionId,
              },
            ],
            metadataJson: {
              formType: "basic",
              address: data.address || data.metadataJson?.address || "",
              area: data.area || 0,
            },
          };

          if (zoneData) {
            await updateCultivationZone.mutateAsync({
              id: zoneData.id,
              data: zoneRequest,
            });
          } else {
            await createCultivationZone.mutateAsync(zoneRequest);
          }
        }

        toast({
          title: "Thành công",
          description: "Cập nhật vùng trồng thành công",
        });
      }

      setLocation("/cultivation-region-identification/crop");
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
    setLocation("/cultivation-region-identification/crop");
  };

  return {
    isEditMode,
    handleComplete,
    handleCancel,
    isSubmitting,
  };
}
