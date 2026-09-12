export type FarmPlanPurpose =
  | "CULTIVATION"
  | "FACILITY_UPGRADE"
  | "TREATMENT"
  | "SOIL_IMPROVEMENT"
  | "HARVEST";

export interface PhotoThumbnailResponse {
  objectKey?: string;
  fileUrl?: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
}

export interface PhotoResponse {
  objectKey: string;
  fileUrl: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  thumbnail?: PhotoThumbnailResponse | null;
}

export interface PhotoRequest {
  objectKey: string;
  fileUrl: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  thumbnail?: PhotoThumbnailResponse | null;
}

export interface SupplyUsageResponse {
  supplyItemId: number;
  unitBaseId: number;
  quantityActual: number;
  name?: string;
  unit?: string;
}

export interface SupplyUsageRequest {
  supplyItemId: number;
  unitBaseId: number;
  quantityActual: number;
}

export interface TaskCategorySummary {
  id: number;
  code?: string;
  name?: string;
}

export interface ScopeLocationSummary {
  id: number;
  code?: string;
  name?: string;
}

export interface WorkflowSnapshot {
  id: number;
  code: string;
  name: string;
}

export interface TaskSnapshot {
  id: number;
  code: string;
  name: string;
  taskCategory?: TaskCategorySummary | null;
  priority?: string | null;
  startDate?: string | null;
  scopeType?: string | null;
  region?: ScopeLocationSummary | null;
  area?: ScopeLocationSummary | null;
  plot?: ScopeLocationSummary | null;
}

export interface DailyDiaryLineResponse {
  dailyTaskId: number;
  task?: TaskSnapshot | null;
  code?: string;
  name: string;
  taskCategory?: TaskCategorySummary | null;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | string;
  startDate: string;
  endDate: string;
  description?: string | null;
  scopeType?: "REGION" | "AREA" | "PLOT" | null;
  region?: ScopeLocationSummary | null;
  area?: ScopeLocationSummary | null;
  plot?: ScopeLocationSummary | null;
  supplies?: SupplyUsageResponse[];
}

export interface DailyDiaryLineRequest {
  dailyTaskId?: number | null;
  name: string;
  taskCategoryId?: number | null;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | string;
  startDate: string;
  endDate: string;
  scopeType?: "REGION" | "AREA" | "PLOT" | null;
  scopeId?: number | null;
  description?: string | null;
  supplies?: SupplyUsageRequest[];
}

export interface HarvestItemResponse {
  targetType: "ZONE" | "ZONE_SUBJECT_VARIANT";
  targetId: number;
  quantity: number;
  unitBaseId: number;
  targetCode?: string;
  targetName?: string;
  productionSubjectCode?: string | null;
  productionSubjectName?: string | null;
}

export interface HarvestItemRequest {
  targetType: "ZONE" | "ZONE_SUBJECT_VARIANT";
  targetId: number;
  quantity: number;
  unitBaseId: number;
}

export interface CreateFarmDailyDiaryEntryRequest {
  workflowId: number;
  seasonId?: number;
  purpose: FarmPlanPurpose;
  description?: string | null;
  photos?: PhotoRequest[];
  lines?: DailyDiaryLineRequest[];
  harvestItems?: HarvestItemRequest[];
}

export interface FarmDailyDiaryEntryResponse {
  id: string;
  code: string;
  workspaceId: number;
  workflowId: number;
  workflow?: WorkflowSnapshot | null;
  hasEvidence?: boolean;
  seasonId?: number;
  purpose: FarmPlanPurpose;
  description?: string | null;
  createdByUserId: number;
  createdAt: string;
  photos: PhotoResponse[];
  lines: DailyDiaryLineResponse[];
  harvestItems?: HarvestItemResponse[];
  editable: boolean;
  editableUntil: string;
}

export interface PageResponseFarmDailyDiaryEntryResponse {
  content: FarmDailyDiaryEntryResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface FarmDailyDiaryStatsResponse {
  totalUpdates: number;
  withEvidence: number;
  withoutEvidence: number;
  latestUpdatedAt: string | null;
}

export interface FarmDailyDiaryQueryParams {
  page?: number;
  size?: number;
  workflowId?: number;
  purpose?: FarmPlanPurpose | FarmPlanPurpose[];
  keyword?: string;
  fromDate?: string;
  toDate?: string;
}

