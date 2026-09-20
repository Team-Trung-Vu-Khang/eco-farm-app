export interface Coordinate {
  lat: number;
  lng: number;
}

export interface GeographicalSelection {
  id: string;
  type: "region" | "area" | "plot";
  regionId: string;
  areaId?: string;
  plotId?: string;
  name?: string;
  regionName?: string;
  areaName?: string;
}

/**
 * Hiện trạng sức khỏe cây trồng (API `healthStatus`).
 * TREATING / DEAD API vẫn nhận nhưng chưa cho chọn trên UI.
 */
export const PLANT_HEALTH_STATUS_LABELS: Record<string, string> = {
  HEALTHY: "Khỏe mạnh",
  PEST: "Bệnh",
  HARVESTED: "Thu hoạch",
  TREATING: "Đang điều trị",
  DEAD: "Đã chết",
};

export type PlantHealthStatus =
  "HEALTHY" | "PEST" | "HARVESTED" | "TREATING" | "DEAD";

/** Màu badge theo hiện trạng sức khỏe */
export const PLANT_HEALTH_STATUS_STYLES: Record<string, string> = {
  HEALTHY: "border-green-200 bg-green-50 text-green-700",
  PEST: "border-red-200 bg-red-50 text-red-700",
  HARVESTED: "border-blue-200 bg-blue-50 text-blue-700",
  TREATING: "border-amber-200 bg-amber-50 text-amber-700",
  DEAD: "border-slate-200 bg-slate-100 text-slate-500",
};

/** Các giá trị cho người dùng chọn trong form */
export const PLANT_HEALTH_STATUS_OPTIONS = [
  "HEALTHY",
  "PEST",
  "HARVESTED",
] as const;

/** Lựa chọn Giống cây / Hạt giống cho cây trồng */
export interface VarietyOption {
  id: string;
  name: string;
  code?: string;
  /** production = Giống cây, subject = Hạt giống */
  variantKind?: "production" | "subject";
}

/** Đơn vị tuổi cây — khớp với plantEntrySchema (Zod enum) */
export type AgeUnit = "days" | "months" | "years";

export interface PlantEntry {
  entryId: string;
  height: string;
  ageValue: string;
  ageUnit: AgeUnit;
  plantedDate: string;
  note: string;
  plotId: string;
  coordinate: Coordinate;
  isInvalidBoundary?: boolean;
  /** Giống / hạt giống của cây, kế thừa từ vùng canh tác đã chọn ở bước 1 */
  varietyId?: string;
  /** `varietyId` là Giống cây (production) hay Hạt giống (subject) */
  variantKind?: "production" | "subject";
  /** Hiện trạng sức khỏe; undefined = chưa đánh giá */
  healthStatus?: PlantHealthStatus;
}

export const makeEmptyPlant = (lat = 11.548, lng = 106.896): PlantEntry => ({
  entryId: `plant-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  height: "",
  ageValue: "",
  ageUnit: "years",
  plantedDate: new Date().toISOString().split("T")[0],
  note: "",
  plotId: "",
  coordinate: { lat, lng },
  isInvalidBoundary: false,
});
