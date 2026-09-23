import treeMarkerIcon from "@/assets/tree.webp";
import type {
  FarmPlantHealthStatus,
  FarmPlantIdentificationResponse,
  PlantIdentificationQueryParams,
} from "@/features/farm/types/farm.type";
import type { CropDetail } from "../../constants";

export type LatLngTuple = [number, number];
export type PlantItem = FarmPlantIdentificationResponse;

export const DEFAULT_CENTER: LatLngTuple = [11.53, 106.88];
const DAYS_PER_MONTH = 30;

/**
 * Bộ lọc tìm kiếm cây trồng — chỉ gồm các tham số API
 * GET /farm/production-identifications hỗ trợ.
 */
export interface SearchCropFilters {
  healthStatus?: FarmPlantHealthStatus;
  /** Giống cây */
  productionSubjectVariantId?: number;
  /** Hạt giống */
  subjectVariantId?: number;
  /** Tuổi cây (tháng) — quy đổi sang ngày khi gọi API */
  ageFromMonths?: number;
  ageToMonths?: number;
  /** Vùng canh tác (OR) */
  productionZoneIds?: number[];
  /** Loại chứng nhận (OR) */
  agricultureCertificateIds?: number[];
}

export const toQueryParams = (
  keyword: string,
  filters: SearchCropFilters,
): PlantIdentificationQueryParams => ({
  domainCode: "CROP",
  keyword: keyword.trim() || undefined,
  healthStatus: filters.healthStatus,
  productionSubjectVariantId: filters.productionSubjectVariantId,
  subjectVariantId: filters.subjectVariantId,
  durationDaysFrom:
    filters.ageFromMonths !== undefined
      ? filters.ageFromMonths * DAYS_PER_MONTH
      : undefined,
  durationDaysTo:
    filters.ageToMonths !== undefined
      ? filters.ageToMonths * DAYS_PER_MONTH
      : undefined,
  productionZoneIds: filters.productionZoneIds?.length
    ? filters.productionZoneIds
    : undefined,
  agricultureCertificateIds: filters.agricultureCertificateIds?.length
    ? filters.agricultureCertificateIds
    : undefined,
});

export const countActiveFilters = (filters: SearchCropFilters) =>
  Object.values(filters).filter((value) =>
    Array.isArray(value) ? value.length > 0 : value !== undefined,
  ).length;

export const parseMonths = (value: string) => {
  if (value === "") return undefined;
  const months = Number(value);
  return Number.isFinite(months) && months >= 0 ? months : undefined;
};

export const getCoordinate = (plant: PlantItem): LatLngTuple | null =>
  typeof plant.latitude === "number" && typeof plant.longitude === "number"
    ? [plant.latitude, plant.longitude]
    : null;

export const getPlantCode = (plant: PlantItem) => plant.code || `#${plant.id}`;

export const getVarietyName = (plant: PlantItem) =>
  plant.productionSubjectVariant?.name ||
  plant.subjectVariant?.name ||
  "Chưa có giống";

/** Lô / Khu vực / Vùng trồng theo phạm vi cây được gán (REGION | AREA | PLOT) */
const resolveLocation = (plant: PlantItem) => {
  const plot = plant.location?.plot;
  const area = plant.location?.area ?? plot?.area;
  const region = plant.location?.region ?? area?.region;
  return { plot, area, region };
};

/** Vị trí dạng "Lô · Khu vực · Vùng" */
export const getLocationText = (plant: PlantItem) => {
  const { plot, area, region } = resolveLocation(plant);
  return [plot?.name, area?.name, region?.name].filter(Boolean).join(" · ");
};

export const getPlantedDate = (plant: PlantItem) =>
  plant.plantedAt ?? plant.startedAt;

export const formatAge = (durationDays?: number) => {
  if (durationDays === undefined || durationDays === null) return "";
  if (durationDays >= 365) return `${Math.floor(durationDays / 365)} năm`;
  if (durationDays >= DAYS_PER_MONTH)
    return `${Math.floor(durationDays / DAYS_PER_MONTH)} tháng`;
  return `${durationDays} ngày`;
};

export const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("vi-VN") : "";

const toCropStatus = (
  healthStatus?: FarmPlantHealthStatus | null,
): CropDetail["status"] => {
  if (healthStatus === "PEST" || healthStatus === "TREATING") return "diseased";
  if (healthStatus === "HARVESTED") return "harvesting";
  if (healthStatus === "DEAD") return "removed";
  return "healthy";
};

/** Chuyển dữ liệu API sang CropDetail để dùng lại dialog chi tiết hiện có */
export const toCropDetail = (plant: PlantItem): CropDetail => {
  const { plot, area, region } = resolveLocation(plant);
  const coordinate = getCoordinate(plant) ?? DEFAULT_CENTER;

  return {
    id: String(plant.id),
    code: getPlantCode(plant),
    name: getVarietyName(plant),
    image: treeMarkerIcon,
    plantedDate: getPlantedDate(plant) ?? "",
    seedType: plant.subjectVariant?.name ?? "",
    variety: plant.productionSubjectVariant?.name ?? "",
    groupCropName: "",
    notes: plant.notes ?? "",
    status: toCropStatus(plant.healthStatus),
    regionId: region?.id ?? 0,
    regionName: region?.name ?? "",
    areaId: area?.id ?? 0,
    areaName: area?.name ?? "",
    plotId: plot ? String(plot.id) : "",
    plotName: plot?.name ?? "",
    coordinate: { lat: coordinate[0], lng: coordinate[1] },
    growthStage: "",
    expectedHarvestDate: "",
    actualAge: plant.durationDays
      ? Math.floor(plant.durationDays / DAYS_PER_MONTH)
      : 0,
    certifications: [],
    cultivationHistory: [],
    diseaseHistory: [],
    harvestHistory: [],
  };
};
