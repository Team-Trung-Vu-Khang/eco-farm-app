import type { Plant } from "@/pages/region-chart/constants";
import type { FarmPlantIdentificationRequest, FarmPlantIdentificationResponse } from "@/features/farm";

export const mapApiPlantToFrontend = (p: FarmPlantIdentificationResponse): Plant => {
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
    status: p.status,
    height: p.height !== undefined && p.height !== null ? String(p.height) : "",
    ageValue,
    ageUnit,
    plantedDate: p.plantedAt || "",
    note: p.notes || "",
    plotId: p.location?.plot?.id?.toString() || p.location?.area?.id?.toString() || p.location?.region?.id?.toString() || "",
    coordinate: { lat: p.latitude || 0, lng: p.longitude || 0 },
    regionName: p.location?.region?.name || "",
    areaName: p.location?.area?.name || "",
    plotName: p.location?.plot?.name || "",
    cultivationZoneName: p.cultivationZone?.name || "",
    scopeType: p.location?.scopeType || "",
    cultivationRegionId: p.cultivationZone?.id?.toString() || "",
  };
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const mapFrontendPlantToApiRequest = (p: Plant, regionStore?: any): FarmPlantIdentificationRequest => {
  let scopeType: "REGION" | "AREA" | "PLOT" = "REGION";

  // Use scopeType passed from frontend if present, otherwise fallback to store checks
  if ((p as any).scopeType) {
    scopeType = (p as any).scopeType;
  } else if (regionStore) {
    const idStr = String(p.plotId);
    if (typeof regionStore.getPlotById === "function" && regionStore.getPlotById(idStr)) {
      scopeType = "PLOT";
    } else if (typeof regionStore.getAreaById === "function" && regionStore.getAreaById(idStr)) {
      scopeType = "AREA";
    } else if (Array.isArray(regionStore.regions) && regionStore.regions.some((r: any) => String(r.id) === idStr)) {
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

  return {
    // code is intentionally omitted when submitting to the server ("không gửi kèm code")
    location: {
      scopeType,
      scopeId: Number(p.plotId),
    },
    cultivationZoneId: (p as any).cultivationRegionId ? Number((p as any).cultivationRegionId) : undefined,
    height: p.height ? Number(p.height) : undefined,
    durationDays: durationDays || undefined,
    plantedAt: p.plantedDate || undefined,
    latitude: p.coordinate.lat,
    longitude: p.coordinate.lng,
    notes: p.note || undefined,
    status: "active",
  };
};
