import type { Plant } from "@/pages/region-chart/constants";
import type {
  FarmPlantIdentificationRequest,
  FarmPlantIdentificationResponse,
} from "@/features/farm";

type AquaculturePlant = Plant & Record<string, any>;

export const mapApiPlantToFrontend = (
  p: FarmPlantIdentificationResponse,
): AquaculturePlant => {
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
    type: "Mẫu nuôi trồng",
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
    scopeType: p.location?.scopeType || "",
    productionZone: (p.productionZone || null) as any,
    cultivationZoneName:
      p.productionZone?.name || p.cultivationZone?.name || "",
    cultivationRegionId:
      p.productionZone?.id?.toString() ||
      p.cultivationZone?.id?.toString() ||
      "",
  };
};

export const mapFrontendPlantToApiRequest = (
  p: Plant,
  regionStore?: any,
  isUpdate?: boolean,
): FarmPlantIdentificationRequest => {
  let scopeType: "REGION" | "AREA" | "PLOT" = "REGION";

  if ((p as any).scopeType) {
    scopeType = (p as any).scopeType;
  } else if (regionStore) {
    const idStr = String(p.plotId);
    if (
      typeof regionStore.getPlotById === "function" &&
      regionStore.getPlotById(idStr)
    ) {
      scopeType = "PLOT";
    } else if (
      typeof regionStore.getAreaById === "function" &&
      regionStore.getAreaById(idStr)
    ) {
      scopeType = "AREA";
    } else if (
      Array.isArray(regionStore.regions) &&
      regionStore.regions.some((r: any) => String(r.id) === idStr)
    ) {
      scopeType = "REGION";
    }
  }

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
  const scopeId = Number(p.plotId);

  if (!Number.isFinite(scopeId) || scopeId <= 0) {
    throw new Error("Vui lòng chọn phạm vi nuôi trồng hợp lệ");
  }

  return {
    ...(isUpdate ? { code: p.code || undefined } : {}),
    location: {
      scopeType,
      scopeId,
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
    domainCode: "AQUACULTURE",
  };
};
