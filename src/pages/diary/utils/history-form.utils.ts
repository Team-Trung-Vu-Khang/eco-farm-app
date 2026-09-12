import type {
  FarmRegionResponse,
  FarmCultivationZoneResponse,
} from "@/features/farm/types/farm.type";
import type { FarmWorkflowScopeResponse } from "@/features/farm-workflow/types/farm-workflow.type";
import type {
  FarmPlanPurpose,
  PhotoRequest,
} from "@/features/farm-daily-diary";
import { farmDailyDiaryApi } from "@/features/farm-daily-diary";
import type {
  HarvestDetail,
  RawSupplyLineItem,
} from "../types/history-form.types";

export function toWorkflowScopeRegionOptions(
  scopes?: FarmWorkflowScopeResponse[],
) {
  if (!scopes || scopes.length === 0) return [];

  const regionMap = new Map<
    number,
    {
      id: number;
      code?: string;
      name: string;
      enterpriseId: string;
      subAreas: Array<{
        id: number;
        name: string;
        plots: Array<{ id: number; name: string }>;
      }>;
    }
  >();

  scopes.forEach((scope) => {
    const region = scope.region ?? scope.area?.region ?? scope.plot?.area?.region;
    if (!region) return;

    let regionObj = regionMap.get(region.id);
    if (!regionObj) {
      regionObj = {
        id: region.id,
        code: region.code,
        name: region.name ?? `Vùng canh tác #${region.id}`,
        enterpriseId: "",
        subAreas: [],
      };
      regionMap.set(region.id, regionObj);
    }

    if (scope.area) {
      let areaObj = regionObj.subAreas.find((a) => a.id === scope.area?.id);
      if (!areaObj) {
        areaObj = {
          id: scope.area.id,
          name: scope.area.name ?? `Khu #${scope.area.id}`,
          plots: [],
        };
        regionObj.subAreas.push(areaObj);
      }
      if (scope.plot) {
        if (!areaObj.plots.some((p) => p.id === scope.plot?.id)) {
          areaObj.plots.push({
            id: scope.plot.id,
            name: scope.plot.name ?? `Lô #${scope.plot.id}`,
          });
        }
      }
    }
  });

  return Array.from(regionMap.values());
}

export function toCultivationZoneOptions(
  apiZones: FarmCultivationZoneResponse[],
) {
  return apiZones.map((z) => {
    const subAreas: Array<{
      id: number;
      name: string;
      plots: Array<{ id: number; name: string }>;
    }> = [];

    (z.scopes || []).forEach((s) => {
      if (s.area) {
        let areaItem = subAreas.find((a) => a.id === s.area?.id);
        if (!areaItem) {
          areaItem = {
            id: s.area.id,
            name: s.area.name ?? `Khu #${s.area.id}`,
            plots: [],
          };
          subAreas.push(areaItem);
        }
        if (s.plot) {
          if (!areaItem.plots.some((p) => p.id === s.plot?.id)) {
            areaItem.plots.push({
              id: s.plot.id,
              name: s.plot.name ?? `Lô #${s.plot.id}`,
            });
          }
        }
      }
    });

    return {
      id: z.id,
      code: z.code,
      name: z.name ?? `Vùng canh tác #${z.id}`,
      enterpriseId: (z.metadataJson?.enterpriseId as string) ?? "",
      subAreas,
    };
  });
}

export function toRegionOptions(apiRegions: FarmRegionResponse[]) {
  return apiRegions.map((r) => ({
    id: r.id,
    code: r.code,
    name: r.name ?? "",
    enterpriseId: (r.metadataJson?.enterpriseId as string) ?? "",
    subAreas: (r.areas ?? []).map((a) => ({
      id: a.id,
      name: a.name ?? "",
      plots: [],
    })),
  }));
}

export function mapSupplyLineItem(s: RawSupplyLineItem) {
  return {
    id: s.id,
    name: s.supplyItem?.name || s.name || `Vật tư #${s.id}`,
    plannedQty: String(s.quantity ?? s.plannedQty ?? 0),
    actualQty: String(s.quantity ?? s.actualQty ?? 0),
    unit: s.unitBase?.name || s.unit || "kg",
  };
}

export function mapWorkflowScopeToHarvestOption(
  scope: FarmWorkflowScopeResponse,
  index: number,
): { label: string; value: string; keywords?: string[] } | null {
  const region = scope.region ?? scope.area?.region ?? scope.plot?.area?.region;
  if (!region) return null;

  if (scope.scopeType === "REGION") {
    return {
      label: region.name || `Vùng #${region.id}`,
      value: `region-${region.id}`,
      keywords: [region.code, region.name].filter(Boolean) as string[],
    };
  }

  if (scope.scopeType === "AREA" && scope.area) {
    return {
      label: `${scope.area.name || `Khu #${scope.area.id}`}`,
      value: `area-${scope.area.id}`,
      keywords: [scope.area.code, scope.area.name, region.name].filter(
        Boolean,
      ) as string[],
    };
  }

  if (scope.scopeType === "PLOT" && scope.plot) {
    const area = scope.area ?? scope.plot.area;
    return {
      label: `${scope.plot.name || `Lô #${scope.plot.id}`}`,
      value: `plot-${scope.plot.id}`,
      keywords: [
        scope.plot.code,
        scope.plot.name,
        area?.name,
        region.name,
      ].filter(Boolean) as string[],
    };
  }

  return {
    label: `Mục ${index + 1}`,
    value: `${scope.scopeType.toLowerCase()}-${index}`,
  };
}

export function createHarvestDetail(
  targetId: string,
  targetLabel: string,
): HarvestDetail {
  return {
    id: `harvest-${targetId}`,
    targetId,
    targetLabel,
    codeName: targetLabel,
    quantity: "",
    unitBase: "kg",
  };
}

export function mapWorkTypeToPurpose(workType: string): FarmPlanPurpose {
  switch (workType) {
    case "facility-upgrade":
      return "FACILITY_UPGRADE";
    case "treatment":
      return "TREATMENT";
    case "amendment":
      return "SOIL_IMPROVEMENT";
    case "harvest":
      return "HARVEST";
    case "cultivation":
    default:
      return "CULTIVATION";
  }
}

export function getFileKey(file: File) {
  return `${file.name}_${file.size}_${file.lastModified}`;
}

export async function uploadPhotosInParallel(
  files: File[],
  wsId: number,
  uploadCache: Map<string, PhotoRequest>,
): Promise<PhotoRequest[]> {
  if (!files || files.length === 0) return [];

  const results: PhotoRequest[] = new Array(files.length);
  const filesToUpload: { file: File; index: number }[] = [];

  files.forEach((file, index) => {
    const key = getFileKey(file);
    if (uploadCache.has(key)) {
      results[index] = uploadCache.get(key)!;
    } else {
      filesToUpload.push({ file, index });
    }
  });

  if (filesToUpload.length > 0) {
    const uploadPromises = filesToUpload.map(async ({ file, index }) => {
      const photoRes = await farmDailyDiaryApi.uploadPhoto(file, true, wsId);
      const photoReq: PhotoRequest = {
        objectKey: photoRes.objectKey,
        fileUrl: photoRes.fileUrl,
        fileName: photoRes.fileName,
        mimeType: photoRes.mimeType,
        sizeBytes: photoRes.sizeBytes,
        thumbnail: photoRes.thumbnail,
      };
      const key = getFileKey(file);
      uploadCache.set(key, photoReq);
      results[index] = photoReq;
    });

    await Promise.all(uploadPromises);
  }

  return results;
}

export function extractCropSubjectVariants(
  zones: FarmCultivationZoneResponse[],
): import("../types/history-form.types").CropSubjectVariantItem[] {
  if (!zones || zones.length === 0) return [];

  const items: import("../types/history-form.types").CropSubjectVariantItem[] = [];
  const seenKey = new Set<string>();

  zones.forEach((zone) => {
    const zoneName = zone.name ?? `Vùng canh tác #${zone.id}`;
    const firstScope = zone.scopes?.[0];
    const regionName =
      firstScope?.region?.name ??
      firstScope?.area?.region?.name ??
      zoneName;

    // 1. Process Foundation Catalog variants (productionSubjectVariants)
    (zone.productionSubjectVariants || []).forEach((v) => {
      if (!v || !v.id) return;
      const targetLinkId = v.linkId ?? v.id;
      const key = `foundation-${zone.id}-${targetLinkId}`;
      if (seenKey.has(key)) return;
      seenKey.add(key);

      items.push({
        id: targetLinkId,
        linkId: targetLinkId,
        variantId: v.id,
        code: v.code ?? `FOUNDATION-${v.id}`,
        name: v.name ?? `Giống Foundation #${v.id}`,
        sourceType: "FOUNDATION",
        zoneId: zone.id,
        zoneName,
        regionName,
      });
    });

    // 2. Process Owner Workspace registered seed/variety variants (subjectVariants)
    (zone.subjectVariants || []).forEach((v) => {
      if (!v || !v.id) return;
      const targetLinkId = v.linkId ?? v.id;
      const key = `owner-${zone.id}-${targetLinkId}`;
      if (seenKey.has(key)) return;
      seenKey.add(key);

      const variantCode =
        v.subjectVariantCode || (v as any).code || `SEED-${v.id}`;
      const variantName =
        v.subjectVariantName || (v as any).name || `Hạt giống #${v.id}`;
      const prodSubjectName = v.productionSubjectName || undefined;

      items.push({
        id: targetLinkId,
        linkId: targetLinkId,
        variantId: v.id,
        code: variantCode,
        name: variantName,
        productionSubjectName: prodSubjectName,
        sourceType: "OWNER",
        zoneId: zone.id,
        zoneName,
        regionName,
      });
    });
  });

  return items;
}

