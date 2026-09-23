import type { FoundationStatus } from "../../foundation/types/foundation.type";

export interface FarmDocumentRequest {
  id?: number;
  documentType?: string;
  name?: string;
  fileUrl?: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  displayOrder?: number;
  content?: string;
}

export interface FarmDocumentResponse {
  id: number;
  documentType?: string;
  name?: string;
  fileUrl?: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  displayOrder?: number;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FarmSeedRequest {
  cropVarietyId: number;
  code?: string;
  name?: string;
  supplierOrganizationId: number;
  origin?: string;
  avgYieldFrom?: number;
  avgYieldTo?: number;
  germinationRate?: number;
  purityRate?: number;
  imageUrl?: string;
  displayOrder?: number;
  status?: FoundationStatus;
  documents?: FarmDocumentRequest[];
  metadataJson?: Record<string, unknown>;
}

export interface FarmSeedResponse {
  id: number;
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  code?: string;
  name?: string;
  subjectVariant?: {
    id: number;
    code?: string;
    name?: string;
  };
  productionSubject?: {
    id: number;
    name?: string;
  };
  cropVariety?: {
    id: number;
    code?: string;
    name?: string;
  };
  crop?: {
    id: number;
    name?: string;
  };
  supplier: {
    id: number;
    code?: string;
    name?: string;
  };
  origin?: string;
  avgYieldFrom?: number;
  avgYieldTo?: number;
  germinationRate?: number;
  purityRate?: number;
  imageUrl?: string;
  displayOrder?: number;
  status: FoundationStatus;
  documents?: FarmDocumentResponse[];
  metadataJson?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SeedQueryParams {
  keyword?: string;
  supplierOrganizationId?: number;
  status?: FoundationStatus;
  page?: number;
  size?: number;
  productionMethodId?: number;
  domainCode?: string;
  foundationSubjectVariantId?: number;
  productionSubjectId?: number;
}

export interface CoordinatePoint {
  latitude?: number;
  longitude?: number;
}

export interface CatalogRef {
  id: number;
  code?: string;
  name?: string;
}

export interface RegionRef {
  id: number;
  code?: string;
  name?: string;
}

export interface RegionProductionSubjectRef {
  id?: number;
  cropId?: number;
  productionSubjectId?: number;
  role?: "MAIN" | "SUB";
  crop?: CatalogRef;
  productionSubject?: CatalogRef;
}

export interface AreaRef {
  id: number;
  code?: string;
  name?: string;
  region?: RegionRef;
  productionRegion?: RegionRef;
}

export interface FarmRegionRequest {
  code?: string;
  name?: string;
  acreage?: number;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  soilTypeId?: number;
  terrainFeatureId?: number;
  boundary?: CoordinatePoint[];
  centerPoint?: CoordinatePoint;
  description?: string;
  status?: FoundationStatus;
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
  crops?: { cropId: number; role: "MAIN" | "SUB" }[];
  productionSubjectIds?: number[];
  areas?: FarmAreaRequest[];
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
}

export interface FarmRegionResponse {
  id: number;
  workspaceId?: number;
  code?: string;
  name?: string;
  acreage?: number;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  soilType?: CatalogRef;
  terrainFeature?: CatalogRef;
  boundary?: CoordinatePoint[];
  centerPoint?: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  status?: FoundationStatus;
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
  productionSubjects?: RegionProductionSubjectRef[];
  crops?: {
    cropId?: number;
    crop?: { id: number; name?: string };
    productionSubjectId?: number;
    productionSubject?: { id: number; code?: string; name?: string };
    role?: string;
  }[];
  productionAreas?: FarmAreaResponse[];
  areas?: FarmAreaResponse[];
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  createdAt?: string;
  updatedAt?: string;
}

export interface RegionQueryParams {
  keyword?: string;
  status?: FoundationStatus;
  page?: number;
  size?: number;
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
}

export interface FarmAreaRequest {
  regionId?: number;
  id?: number;
  code?: string;
  name?: string;
  acreage?: number;
  soilTypeId?: number;
  terrainFeatureId?: number;
  boundary?: CoordinatePoint[];
  centerPoint?: CoordinatePoint;
  status?: FoundationStatus;
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
  plots?: FarmPlotRequest[];
}

export interface FarmAreaResponse {
  id: number;
  workspaceId?: number;
  region?: RegionRef;
  productionRegion?: RegionRef;
  code?: string;
  name?: string;
  acreage?: number;
  soilType?: CatalogRef;
  terrainFeature?: CatalogRef;
  boundary?: CoordinatePoint[];
  centerPoint?: CoordinatePoint;
  status?: FoundationStatus;
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
  plots?: FarmPlotResponse[];
  productionUnits?: FarmPlotResponse[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AreaQueryParams {
  regionId?: number;
  keyword?: string;
  status?: FoundationStatus;
  page?: number;
  size?: number;
}

export interface FarmPlotRequest {
  id?: number;
  code?: string;
  name?: string;
  acreage?: number;
  elevation?: number;
  contourInterval?: number;
  boundary?: CoordinatePoint[];
  status?: FoundationStatus;
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
}

export interface FarmPlotResponse {
  id: number;
  workspaceId?: number;
  area?: AreaRef;
  productionArea?: AreaRef;
  code?: string;
  name?: string;
  acreage?: number;
  elevation?: number;
  contourInterval?: number;
  boundary?: CoordinatePoint[];
  status?: FoundationStatus;
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlotQueryParams {
  areaId?: number;
  keyword?: string;
  status?: FoundationStatus;
  page?: number;
  size?: number;
}

// ─── Cultivation Zone ─────────────────────────────────────────────────────────

export type FarmCultivationZoneScopeType = "REGION" | "AREA" | "PLOT";

export type FarmCultivationZoneStatus = "active" | "inactive" | "archived";

export interface FarmCultivationZoneScopeRequest {
  scopeType: FarmCultivationZoneScopeType;
  scopeId: number;
}

export interface PlotRef {
  id: number;
  code?: string;
  name?: string;
  area?: AreaRef;
}

export interface PersonnelRef {
  id: number;
  fullName?: string;
  avatarUrl?: string;
  position?: CatalogRef;
}

export interface SeedRef {
  id: number;
  cropVarietyCode?: string;
  cropVarietyName?: string;
  cropName?: string;
}

export interface SubjectVariantRef {
  linkId?: number;
  id: number;
  subjectVariantCode?: string;
  subjectVariantName?: string;
  productionSubjectCode?: string;
  productionSubjectName?: string;
}

export interface FarmCultivationZoneScopeResponse {
  scopeType: FarmCultivationZoneScopeType;
  region?: RegionRef;
  area?: AreaRef;
  plot?: PlotRef;
}

export interface FarmCultivationZoneRequest {
  code?: string;
  name?: string;
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  scopes?: FarmCultivationZoneScopeRequest[];
  certificateIds?: number[];
  personnelIds?: number[];
  /** Phương pháp canh tác (API mới: productionMethodId thay cho farmingMethodId) */
  productionMethodId: number;
  rearingMethodId?: number;
  irrigationSystemId?: number;
  /**
   * Giống Foundation (productionSubjectVariant IDs).
   * Gửi khi user chọn giống từ danh mục foundation, KHÔNG có hạt giống owner.
   * Loại trừ lẫn nhau với subjectVariantIds.
   */
  productionSubjectVariantIds?: number[];
  /**
   * Hạt giống / con giống owner (subjectVariant IDs từ /api/farm/seeds).
   * Gửi khi user chọn hạt giống đã đăng ký của farm.
   * Loại trừ lẫn nhau với productionSubjectVariantIds.
   */
  subjectVariantIds?: number[];
  /** Phương thức cập nhật tình trạng sức khỏe vùng canh tác: "zone" / "individual" */
  healthUpdateMode?: "zone" | "individual" | "ZONE" | "INDIVIDUAL";
  notes?: string;
  status?: FarmCultivationZoneStatus;
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
}

export interface FarmCultivationZoneResponse {
  id: number;
  code?: string;
  name?: string;
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  /** Phương thức cập nhật tình trạng sức khỏe vùng canh tác */
  healthUpdateMode?: "zone" | "individual" | "ZONE" | "INDIVIDUAL";
  scopes?: FarmCultivationZoneScopeResponse[];
  certificates?: CatalogRef[];
  personnel?: PersonnelRef[];
  farmingMethod?: CatalogRef;
  productionMethod?: CatalogRef;
  rearingMethod?: CatalogRef;
  irrigationSystem?: CatalogRef;
  seeds?: SeedRef[];
  notes?: string;
  /** Giống Foundation đang được gán (khi không dùng hạt giống owner) */
  productionSubjectVariants?: Array<{
    linkId?: number;
    id: number;
    code?: string;
    name?: string;
  }>;
  /** Hạt giống / con giống owner đang được gán */
  subjectVariants?: SubjectVariantRef[];
  status?: FarmCultivationZoneStatus;
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  centerPoint?: {
    latitude: number;
    longitude: number;
  };
}

export interface CultivationZoneQueryParams {
  regionId?: number;
  areaId?: number;
  plotId?: number;
  keyword?: string;
  status?: FarmCultivationZoneStatus;
  farmingMethodId?: number;
  rearingMethodId?: number;
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  includeDetails?: boolean;
  page?: number;
  size?: number;
}

// ─── Plant Identification ───────────────────────────────────────────────────

/**
 * Hiện trạng sức khỏe cây trồng. `null` = chưa đánh giá.
 * TREATING và DEAD hiện chưa hiển thị trên UI nhưng API vẫn nhận.
 */
export type FarmPlantHealthStatus =
  | "HEALTHY"
  | "PEST"
  | "HARVESTED"
  | "TREATING"
  | "DEAD";

/** Giống cây (danh mục gốc) hoặc hạt giống (của workspace) gắn với cây trồng */
export interface PlantVariantRef {
  id: number;
  code?: string;
  name?: string;
}

export interface FarmPlantIdentificationRequest {
  code?: string;
  location: FarmCultivationZoneScopeRequest;
  cultivationZoneId?: number;
  productionZoneId?: number;
  height?: number;
  durationDays?: number;
  plantedAt?: string;
  startedAt?: string;
  latitude: number;
  longitude: number;
  notes?: string;
  status?: "active" | "inactive" | "archived";
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  /** Giống cây (Foundation) — có thể gửi đồng thời với `subjectVariantId`; bắt buộc ít nhất một trong hai */
  productionSubjectVariantId?: number;
  /** Hạt giống (FarmSeed) — cascade theo `productionSubjectVariantId`; bắt buộc ít nhất một trong hai */
  subjectVariantId?: number;
  /** Không gửi hoặc gửi null khi sửa đều giữ nguyên giá trị hiện có */
  healthStatus?: FarmPlantHealthStatus;
}

/** Phần JSON `request` của bulk-upload — dùng chung cho mọi dòng trong file Excel. */
export interface FarmPlantIdentificationBulkUploadRequest {
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  location: FarmCultivationZoneScopeRequest;
  cultivationZoneId?: number;
  /** Bắt buộc ít nhất 1 trong 2: `productionSubjectVariantId` / `subjectVariantId` */
  productionSubjectVariantId?: number;
  subjectVariantId?: number;
  /**
   * Map code → label để dịch giá trị trong file (VD: "healthStatus.HEALTHY": "Khỏe mạnh",
   * "durationUnit.DAY": "ngày"). Thiếu code nào thì BE fallback nhãn tiếng Việt mặc định.
   */
  i18n?: Partial<
    Record<
      `healthStatus.${FarmPlantHealthStatus}` | `durationUnit.${"DAY" | "MONTH" | "YEAR"}`,
      string
    >
  >;
}

/** Giá trị Spring Batch gốc — FE tự map label. */
export type BulkUploadJobStatus =
  | "STARTING"
  | "STARTED"
  | "STOPPING"
  | "STOPPED"
  | "COMPLETED"
  | "FAILED"
  | "ABANDONED"
  | "UNKNOWN";

export interface FarmPlantIdentificationBulkUploadSubmitResponse {
  jobExecutionId: number;
  status: BulkUploadJobStatus;
}

export interface FarmPlantIdentificationBulkUploadStatusResponse {
  status: BulkUploadJobStatus;
  progress: { totalRows: number; processedRows: number } | null;
  /** Có khi job kết thúc; job vẫn COMPLETED dù có dòng lỗi (partial success) */
  result: {
    totalRows: number;
    successRows: number;
    failedRows: number;
    errors: { rowNumber: number; message: string }[];
  } | null;
}

export interface FarmPlantIdentificationResponse {
  id: number;
  workspaceId?: number;
  location?: FarmCultivationZoneScopeResponse;
  cultivationZone?: CatalogRef;
  productionZone?: CatalogRef;
  code?: string;
  height?: number;
  durationDays?: number;
  plantedAt?: string;
  startedAt?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  status: "active" | "inactive" | "archived";
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
  createdAt?: string;
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  updatedAt?: string;
  /** Cây tạo trước 2026-09-20 có giá trị null */
  productionSubjectVariant?: PlantVariantRef | null;
  /** Null khi cây chỉ gắn giống cây, không gắn hạt giống */
  subjectVariant?: PlantVariantRef | null;
  /** Null nghĩa là chưa đánh giá */
  healthStatus?: FarmPlantHealthStatus | null;
}

export interface PlantIdentificationQueryParams {
  regionId?: number;
  areaId?: number;
  plotId?: number;
  cultivationZoneId?: number;
  productionZoneId?: number;
  /** Tìm theo mã cây, code/tên giống cây, code/tên hạt giống */
  keyword?: string;
  status?: string;
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  page?: number;
  size?: number;
  /** Lọc theo Giống cây */
  productionSubjectVariantId?: number;
  /** Lọc theo Hạt giống */
  subjectVariantId?: number;
  healthStatus?: FarmPlantHealthStatus;
  /** Id loại chứng nhận, OR trong danh sách */
  agricultureCertificateIds?: number[];
  /** Tuổi tối thiểu tính bằng NGÀY (UI nhập tháng/năm thì tự quy đổi) */
  durationDaysFrom?: number;
  /** Tuổi tối đa tính bằng NGÀY */
  durationDaysTo?: number;
  /** Nhiều vùng canh tác (OR) */
  productionZoneIds?: number[];
}

// ─── Production Health Metrics ──────────────────────────────────────────────

export interface FarmProductionHealthMetricRequest {
  location: FarmCultivationZoneScopeRequest;
  totalCount?: number;
  healthyCount?: number;
  pestCount?: number;
  harvestedCount?: number;
  soilPh?: number;
  soilTemperature?: number;
  soilMoisturePct?: number;
  soilCompaction?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  organicMatterPct?: number;
  metadataJson?: Record<string, unknown>;
}

export interface FarmProductionHealthMetricResponse {
  id: number;
  workspaceId?: number;
  location?: FarmCultivationZoneScopeResponse;
  totalCount?: number;
  healthyCount?: number;
  pestCount?: number;
  harvestedCount?: number;
  soilPh?: number;
  soilTemperature?: number;
  soilMoisturePct?: number;
  soilCompaction?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  organicMatterPct?: number;
  source?: string;
  computedAt?: string;
  metadataJson?: Record<string, unknown>;
}

export interface ProductionHealthMetricScopeQueryParams {
  scopeType: FarmCultivationZoneScopeType;
  scopeId: number;
}

export interface PlantIdentificationResolveLocationQueryParams {
  latitude: number;
  longitude: number;
  scopeType: FarmCultivationZoneScopeType;
  scopeId: number;
}

export interface FarmPlantIdentificationResolveLocationResponse {
  resolvedToPlot: boolean;
  location?: FarmCultivationZoneScopeResponse;
}
