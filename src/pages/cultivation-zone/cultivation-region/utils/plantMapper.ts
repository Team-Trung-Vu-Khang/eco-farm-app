import type {
  FarmPlantHealthStatus,
  FarmPlantIdentificationRequest,
  FarmPlantIdentificationResponse,
} from "@/features/farm";
import type { Plant } from "@/pages/region-chart/constants";

type CultivationPlant = Plant & Record<string, any>;

export const mapApiPlantToFrontend = (
  p: FarmPlantIdentificationResponse,
): CultivationPlant => {
  let ageValue = "";
  let ageUnit: "days" | "months" | "years" = "years";

  if (p.durationDays !== undefined && p.durationDays !== null) {
    const days = p.durationDays;
    if (days % 365 === 0) {
      ageValue = String(days / 365);
      ageUnit = "years";
    } else if (days % 30 === 0) {
      ageValue = String(days / 30);
      ageUnit = "months";
    } else {
      ageValue = String(days);
      ageUnit = "days";
    }
  }

  return {
    id: String(p.id),
    code: p.code || "",
    name: p.code || String(p.id),
    type: "Cây trồng",
    status: p.status as any,
    height: p.height !== undefined && p.height !== null ? String(p.height) : "",
    ageValue,
    ageUnit,
    plantedDate: p.startedAt || p.plantedAt || "",
    note: p.notes || "",
    plotId:
      p.location?.plot?.id?.toString() ||
      p.location?.area?.id?.toString() ||
      p.location?.region?.id?.toString() ||
      "",
    coordinate: { lat: p.latitude || 0, lng: p.longitude || 0 },
    regionName:
      p.location?.region?.name ||
      p.location?.area?.name ||
      p.location?.plot?.name ||
      "",
    areaName: p.location?.area?.name || "",
    plotName: p.location?.plot?.name || "",
    productionZone: (p.productionZone || null) as any,
    cultivationZoneName:
      p.productionZone?.name || p.cultivationZone?.name || "",
    scopeType: p.location?.scopeType || "",
    cultivationRegionId:
      p.productionZone?.id?.toString() ||
      p.cultivationZone?.id?.toString() ||
      "",
    // Giống cây (Foundation) + Hạt giống (FarmSeed) — có thể gửi đồng thời cả hai
    productionVariantId: p.productionSubjectVariant?.id
      ? String(p.productionSubjectVariant.id)
      : "",
    productionVariantName: p.productionSubjectVariant?.name || "",
    subjectVariantId: p.subjectVariant?.id ? String(p.subjectVariant.id) : "",
    subjectVariantName: p.subjectVariant?.name || "",
    healthStatus: p.healthStatus ?? undefined,
    variantName:
      p.subjectVariant?.name || p.productionSubjectVariant?.name || "",
  };
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const mapFrontendPlantToApiRequest = (
  p: Plant,
  isUpdate?: boolean,
): FarmPlantIdentificationRequest => {
  const scopeType: "REGION" | "AREA" | "PLOT" =
    (p as any).scopeType || "REGION";

  let durationDays = 0;
  if (p.ageValue) {
    const val = Number(p.ageValue);
    if (p.ageUnit === "days") durationDays = val;
    else if (p.ageUnit === "months") durationDays = val * 30;
    else if (p.ageUnit === "years") durationDays = val * 365;
  }

  const zoneId = (p as any).cultivationRegionId
    ? Number((p as any).cultivationRegionId)
    : undefined;

  const rawProductionVariantId = (p as any).productionVariantId;
  const productionSubjectVariantId = rawProductionVariantId
    ? Number(rawProductionVariantId)
    : undefined;
  const rawSubjectVariantId = (p as any).subjectVariantId;
  const subjectVariantId = rawSubjectVariantId
    ? Number(rawSubjectVariantId)
    : undefined;
  const healthStatus = (p as any).healthStatus as
    | FarmPlantHealthStatus
    | undefined;

  return {
    ...(isUpdate ? { code: p.code || undefined } : {}),
    location: {
      scopeType,
      scopeId: Number(p.plotId),
    },
    cultivationZoneId: zoneId,
    productionZoneId: zoneId,
    height: p.height ? Number(p.height) : undefined,
    durationDays: durationDays || undefined,
    plantedAt: p.plantedDate || undefined,
    startedAt: p.plantedDate || undefined,
    latitude: p.coordinate.lat,
    longitude: p.coordinate.lng,
    notes: p.note || undefined,
    status: "active",
    domainCode: "CROP",
    // API cho phép gửi đồng thời cả Giống cây (productionSubjectVariantId) và
    // Hạt giống (subjectVariantId); bắt buộc ít nhất một trong hai.
    ...(productionSubjectVariantId
      ? { productionSubjectVariantId }
      : {}),
    ...(subjectVariantId ? { subjectVariantId } : {}),
    ...(healthStatus ? { healthStatus } : {}),
  };
};
