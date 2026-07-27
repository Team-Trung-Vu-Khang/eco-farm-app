import { useEffect, useState } from "react";
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
  const [hasInitialized, setHasInitialized] = useState(false);

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
    if (hasInitialized) return;

    if (isEditMode) {
      if (!zoneData) return; // wait for data

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
        irrigationSystemId: zoneData.irrigationSystem?.id ?? 0,
        seedIds: (zoneData.seeds ?? zoneData?.subjectVariants ?? []).map(
          (s) => s.id,
        ),
        certificateIds: (zoneData.certificates ?? []).map((c) => c.id),
        personnelIds: (zoneData.personnel ?? []).map((p) => p.id),
        notes: zoneData.notes ?? "",
        status:
          (zoneData.status as "active" | "inactive" | "archived") ?? "active",
      });
      setHasInitialized(true);
    } else {
      reset({
        name: "",
        selections: [],
        farmingMethodId: 0,
        irrigationSystemId: 0,
        seedIds: [],
        certificateIds: [],
        personnelIds: [],
        notes: "",
        status: "active",
      });
      setHasInitialized(true);
    }
  }, [isEditMode, zoneData, reset, hasInitialized]);

  // ─── Submit ────────────────────────────────────────────────────────────
  const handleComplete = async (data: CultivationZoneFormValues) => {
    setIsSubmitting(true);
    try {
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
        irrigationSystemId: Number(data.irrigationSystemId),
        seedIds: (data.seedIds ?? []).map(Number).filter((id) => !isNaN(id)),
        certificateIds: isEditMode
          ? (data.certificateIds ?? []).map(Number).filter((id) => !isNaN(id))
          : undefined,
        personnelIds: (data.personnelIds ?? [])
          .map(Number)
          .filter((id) => !isNaN(id)),
        notes: data.notes || undefined,
        status: data.status,
        displayOrder: zoneData?.displayOrder,
        metadataJson: zoneData?.metadataJson,
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

  return { handleComplete, handleCancel, isSubmitting, isEditMode };
}
