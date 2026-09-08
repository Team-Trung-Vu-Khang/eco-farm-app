import { useEffect, useState, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useCultivationZoneMutations } from "@/features/farm/hooks/useCultivationZoneMutations";
import { useCultivationZoneById } from "@/features/farm/hooks/useCultivationZones";
import type { FarmCultivationZoneRequest } from "@/features/farm/types/farm.type";
import type { CultivationZoneFormValues } from "../data/cultivation-zone-form.schema";

export function useAquacultureZoneCreateForm(
  reset: (values: Partial<CultivationZoneFormValues>) => void,
) {
  const basePath = "/aquaculture-region";
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasInitializedRef = useRef(false);

  // ─── Edit mode detection ───────────────────────────────────────────────
  const [matchEdit, paramsEdit] = useRoute<{ id: string }>(
    `${basePath}/:id/edit`,
  );
  const isEditMode = matchEdit && !!paramsEdit?.id;
  const zoneId = parseInt(paramsEdit?.id || "0", 10);

  const { data: zoneData } = useCultivationZoneById(zoneId, {
    enabled: isEditMode && zoneId > 0,
  });

  const { createCultivationZone, updateCultivationZone } =
    useCultivationZoneMutations();

  // ─── Initialise form defaults ──────────────────────────────────────────
  useEffect(() => {
    if (hasInitializedRef.current) return;

    if (isEditMode) {
      if (!zoneData) return; // wait for data

      // Build varietyLabels and varietyCropMap
      const varietyLabels: Record<string, string> = {};
      const varietyCropMap: Record<string, string> = {};

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

      reset({
        id: zoneData.id,
        code: zoneData.code,
        name: zoneData.name ?? "",
        selections: (zoneData.scopes ?? []).map((s) => {
          if (s.scopeType === "REGION") {
            return {
              id: `scope-region-${s.region?.id}`,
              type: "region" as const,
              regionId: String(s.region?.id ?? 0),
              name: s.region?.name ?? "",
            };
          }
          if (s.scopeType === "AREA") {
            return {
              id: `scope-area-${s.area?.id}`,
              type: "area" as const,
              regionId: String(s.area?.region?.id ?? 0),
              areaId: String(s.area?.id ?? 0),
              name: s.area?.name ?? "",
              regionName: s.area?.region?.name ?? "",
            };
          }
          return {
            id: `scope-plot-${s.plot?.id}`,
            type: "plot" as const,
            regionId: String(s.plot?.area?.region?.id ?? 0),
            areaId: String(s.plot?.area?.id ?? 0),
            plotId: String(s.plot?.id ?? 0),
            name: s.plot?.name ?? "",
            regionName: s.plot?.area?.region?.name ?? "",
            areaName: s.plot?.area?.name ?? "",
          };
        }),
        farmingMethodId: zoneData.productionMethod?.id ?? 0,
        rearingMethodId: zoneData.rearingMethod?.id ?? 0,
        seedIds: (zoneData.subjectVariants ?? zoneData.seeds ?? []).map((s) => s.id),
        cropIds:
          (zoneData.metadataJson?.selectedCropIds as string[]) ||
          (zoneData.subjectVariants ?? []).map((s) =>
            (s.productionSubject?.id || s.crop?.id || 0).toString(),
          ).filter((id) => id !== "0"),
        cropSeedToggles:
          (zoneData.metadataJson?.cropSeedToggles as Record<string, boolean>) || {},
        varietyIds:
          (zoneData.productionSubjectVariants ?? []).map((v) => v.id).filter(
            (id) => id > 0,
          ).length > 0
            ? (zoneData.productionSubjectVariants ?? []).map((v) => v.id)
            : (zoneData.subjectVariants ?? []).map(
                (s) => s.cropVariety?.id || s.subjectVariant?.id || 0,
              ).filter((id) => id > 0),
        useSpecificSeeds: (zoneData.subjectVariants ?? []).length > 0,
        varietyLabels,
        varietyCropMap,
        certificateIds: (zoneData.certificates ?? []).map((c) => c.id),
        personnelIds: (zoneData.personnel ?? []).map((p) => p.id),
        notes: zoneData.notes ?? "",
        status:
          (zoneData.status as "active" | "inactive" | "archived") ?? "active",
      });
      hasInitializedRef.current = true;
    } else {
      reset({
        name: "",
        selections: [],
        farmingMethodId: 0,
        rearingMethodId: 0,
        seedIds: [],
        cropIds: [],
        cropSeedToggles: {},
        varietyIds: [],
        useSpecificSeeds: false,
        certificateIds: [],
        personnelIds: [],
        notes: "",
        status: "active",
      });
      hasInitializedRef.current = true;
    }
  }, [isEditMode, zoneData, reset]);

  // ─── Submit ────────────────────────────────────────────────────────────
  const handleComplete = async (
    data: CultivationZoneFormValues,
    isDetailMode: boolean,
  ) => {
    setIsSubmitting(true);
    try {
      const buildVariantPayload = (useSpecific: boolean, seedIds: number[], varietyIds: number[]) => {
        if (useSpecific) {
          return { subjectVariantIds: seedIds };
        } else {
          return { productionSubjectVariantIds: varietyIds };
        }
      };

      const seedIds = (data.seedIds ?? []).map(Number).filter((id) => !isNaN(id) && id > 0);
      const varietyIds = (data.varietyIds ?? []).filter((id) => id > 0);

      const request: FarmCultivationZoneRequest = {
        code: isEditMode ? zoneData?.code || data.code : undefined,
        name: data.name,
        domainCode: "AQUACULTURE",
        scopes: (data.selections ?? [])
          .map((s) => {
            let scopeId = 0;
            if (s.type === "plot") {
              scopeId = parseInt(String(s.plotId), 10);
            } else if (s.type === "area") {
              scopeId = parseInt(String(s.areaId), 10);
            } else {
              scopeId = parseInt(String(s.regionId), 10);
            }
            return {
              scopeType: (s.type === "region"
                ? "REGION"
                : s.type === "area"
                  ? "AREA"
                  : "PLOT") as "REGION" | "AREA" | "PLOT",
              scopeId,
            };
          })
          .filter((s) => !isNaN(s.scopeId)),
        farmingMethodId: Number(data.farmingMethodId),
        rearingMethodId: data.rearingMethodId
          ? Number(data.rearingMethodId)
          : undefined,
        ...buildVariantPayload(!!data.useSpecificSeeds, seedIds, varietyIds),
        certificateIds: isEditMode
          ? (data.certificateIds ?? []).map(Number).filter((id) => !isNaN(id))
          : undefined,
        personnelIds: (data.personnelIds ?? [])
          .map(Number)
          .filter((id) => !isNaN(id)),
        notes: data.notes || undefined,
        status: data.status,
        displayOrder: zoneData?.displayOrder,
        metadataJson: {
          ...(zoneData?.metadataJson ?? {}),
          formType: isDetailMode ? "advanced" : "basic",
        },
      };

      if (isEditMode && zoneId > 0) {
        await updateCultivationZone.mutateAsync({ id: zoneId, data: request });
        toast({
          title: "Thành công",
          description: "Đã cập nhật vùng nuôi trồng thành công",
        });
      } else {
        await createCultivationZone.mutateAsync(request);
        toast({
          title: "Thành công",
          description: "Đã tạo mới vùng nuôi trồng thành công",
        });
      }

      setLocation(basePath);
    } catch {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi lưu thông tin",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => setLocation(basePath);

  return { handleComplete, handleCancel, isSubmitting, isEditMode, zoneData };
}
