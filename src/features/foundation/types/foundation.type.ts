// ─── Shared ───────────────────────────────────────────────────────────────────

export type FoundationStatus =
  | "active"
  | "inactive"
  | "archived"
  | (string & {});

/** Generic paginated response — khớp với tất cả PageResponse* schemas trong api.json */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface BaseQueryParams {
  keyword?: string;
  status?: FoundationStatus;
  page?: number;
  size?: number;
}

// ─── Catalogs ─────────────────────────────────────────────────────────────────
// Endpoint: GET/POST /api/foundation/{catalog}
// Endpoint: GET/PUT/DELETE /api/foundation/{catalog}/{id}

export type CatalogType =
  | "crop-groups"
  | "farming-methods"
  | "soil-types"
  | "terrain-features"
  | "terrain-parameters";

export interface CatalogRecordRequest {
  code?: string;
  name?: string;
  description?: string;
  displayOrder?: number;
  status?: FoundationStatus;
  metadataJson?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
}

export interface CatalogRecordResponse {
  id: number;
  code: string;
  name: string;
  description?: string;
  displayOrder?: number;
  status: FoundationStatus;
  metadataJson?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

export type CatalogQueryParams = BaseQueryParams;

// ─── Crops ────────────────────────────────────────────────────────────────────
// Endpoint: GET/POST /api/foundation/crops
// Endpoint: GET/PUT/DELETE /api/foundation/crops/{id}

export interface FoundationCropTechnicalSpecs {
  scientificName?: string;
  family?: string;
  origin?: string;
  temperatureFrom?: number;
  temperatureTo?: number;
  humidityFrom?: number;
  humidityTo?: number;
  phFrom?: number;
  phTo?: number;
  plantingDensity?: string;
}

export interface FoundationDocument {
  id?: number;
  type?: string;
  name?: string;
  content?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface FoundationCropRequest {
  code?: string;
  name?: string;
  cropGroupId: number; // required
  description?: string;
  harvestMethod?: string;
  imageUrl?: string;
  technicalSpecs?: FoundationCropTechnicalSpecs;
  documents?: FoundationDocument[];
  displayOrder?: number;
  status?: FoundationStatus;
  metadataJson?: Record<string, unknown>;
}

export interface FoundationCropResponse {
  id: number;
  code: string;
  name: string;
  cropGroupId: number;
  cropGroupCode: string;
  cropGroupName: string;
  description?: string;
  harvestMethod?: string;
  imageUrl?: string;
  technicalSpecs?: FoundationCropTechnicalSpecs;
  documents?: FoundationDocument[];
  displayOrder?: number;
  status: FoundationStatus;
  metadataJson?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type CropQueryParams = BaseQueryParams;

// ─── Crop Varieties ───────────────────────────────────────────────────────────
// Endpoint: GET/POST /api/foundation/crop-varieties
// Endpoint: GET/PUT/DELETE /api/foundation/crop-varieties/{id}

export interface FoundationCropVarietyRequest {
  code?: string;
  name?: string;
  cropId: number; // required
  description?: string;
  origin?: string;
  growthDurationDays?: number;
  avgYieldFrom?: number;
  avgYieldTo?: number;
  displayOrder?: number;
  status?: FoundationStatus;
  metadataJson?: Record<string, unknown>;
  documents?: FoundationDocument[];
}

export interface FoundationCropVarietyResponse {
  id: number;
  code: string;
  name: string;
  cropId: number;
  cropCode: string;
  cropName: string;
  description?: string;
  origin?: string;
  growthDurationDays?: number;
  avgYieldFrom?: number;
  avgYieldTo?: number;
  displayOrder?: number;
  status: FoundationStatus;
  metadataJson?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  documents?: FoundationDocument[];
}

export interface CropVarietyQueryParams extends BaseQueryParams {
  cropId?: number;
}

// ─── Growth Cycle Templates ───────────────────────────────────────────────────
// Endpoint: GET/POST /api/foundation/growth-cycle-templates
// Endpoint: GET/PUT/DELETE /api/foundation/growth-cycle-templates/{id}

export interface FoundationGrowthCycleStageRequest {
  name?: string;
  durationDays: number; // required
  description?: string;
  displayOrder?: number;
  document?: FoundationDocument;
}

export interface FoundationGrowthCycleStageResponse {
  id: number;
  code: string;
  name: string;
  durationDays: number;
  description?: string;
  displayOrder?: number;
  document?: FoundationDocument;
  status: FoundationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FoundationGrowthCycleTemplateRequest {
  code?: string;
  name?: string;
  cropId?: number;
  cropVarietyId?: number;
  cropGroupId?: number;
  expectedDays?: number;
  description?: string;
  stages?: FoundationGrowthCycleStageRequest[];
  displayOrder?: number;
  status?: FoundationStatus;
  metadataJson?: Record<string, unknown>;
}

export interface FoundationGrowthCycleTemplateResponse {
  id: number;
  code: string;
  name: string;
  cropId?: number;
  cropCode?: string;
  cropName?: string;
  cropVarietyId?: number;
  cropVarietyCode?: string;
  cropVarietyName?: string;
  cropGroupId?: number;
  cropGroupCode?: string;
  cropGroupName?: string;
  expectedDays?: number;
  description?: string;
  stages?: FoundationGrowthCycleStageResponse[];
  displayOrder?: number;
  status: FoundationStatus;
  metadataJson?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface GrowthCycleTemplateQueryParams extends BaseQueryParams {
  cropId?: number;
}

// ─── Farming Method Crops ─────────────────────────────────────────────────────
// Endpoint: GET/POST /api/foundation/farming-method-crops
// Endpoint: GET/PUT/DELETE /api/foundation/farming-method-crops/{id}

export interface CropAssignment {
  cropId: number;
  varietyIds?: number[];
}

export interface CropAssignmentView {
  cropId: number;
  cropCode: string;
  cropName: string;
  cropGroupId?: number;
  cropGroupCode?: string;
  cropGroupName?: string;
  varieties?: { id: number; code?: string; name?: string }[];
}

export interface FarmingMethodCropRequest {
  code?: string;
  farmingMethodId?: number;
  description?: string;
  displayOrder?: number;
  status?: FoundationStatus;
  crops?: CropAssignment[];
}

export interface FarmingMethodCropResponse {
  id: number;
  code: string;
  farmingMethodId?: number;
  farmingMethodCode?: string;
  farmingMethodName?: string;
  description?: string;
  displayOrder?: number;
  status: FoundationStatus;
  cropCount?: number;
  createdAt: string;
  updatedAt: string;
  crops?: CropAssignmentView[];
}

export interface FarmingMethodCropQueryParams {
  keyword?: string;
  status?: FoundationStatus;
}
