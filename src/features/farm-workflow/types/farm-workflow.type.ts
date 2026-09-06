import type { DomainCode, SupplyType } from "@/features/farm-supply/types";
import type { PageResponse } from "@/features/foundation/types/foundation.type";

export type FarmWorkflowRequestStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";
export type FarmWorkflowResponseStatus = "active" | "inactive" | "archived";

export type FarmPlanStatus =
  | "DRAFT"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type FarmPlanPurpose =
  | "CULTIVATION"
  | "FACILITY_UPGRADE"
  | "TREATMENT"
  | "SOIL_IMPROVEMENT"
  | "HARVEST";

export type FarmPlanPersonnelRole =
  | "MANAGER"
  | "QUALITY_INSPECTOR"
  | "EXECUTOR";
export type FarmWorkDurationUnit = "MINUTE" | "HOUR" | "DAY" | "WEEK";
export type FarmWorkflowScopeType = "REGION" | "AREA" | "PLOT";

export interface FarmCatalogRef {
  id: number;
  code?: string;
  name?: string;
}

export interface FarmWorkflowScopeRequest {
  scopeType: FarmWorkflowScopeType;
  scopeId: number;
}

export interface FarmWorkflowSeasonRef {
  id: number;
  code?: string;
  name?: string;
}

// Only the scope's own type is guaranteed populated at the top level — e.g.
// an AREA scope has `region: null` and carries the region under `area.region`
// instead, and a PLOT scope nests both area and region under `plot`.
export interface FarmWorkflowRegionRef {
  id: number;
  code?: string;
  name?: string;
}

export interface FarmWorkflowAreaRef {
  id: number;
  code?: string;
  name?: string;
  region?: FarmWorkflowRegionRef | null;
}

export interface FarmWorkflowPlotRef {
  id: number;
  code?: string;
  name?: string;
  area?: FarmWorkflowAreaRef | null;
}

export interface FarmWorkflowScopeResponse {
  scopeType: FarmWorkflowScopeType;
  region?: FarmWorkflowRegionRef | null;
  area?: FarmWorkflowAreaRef | null;
  plot?: FarmWorkflowPlotRef | null;
}

export interface FarmWorkflowStatusBreakdown {
  draft?: number;
  inProgress?: number;
  completed?: number;
  cancelled?: number;
}

export interface FarmWorkflowRequest {
  domainCode: DomainCode;
  code?: string | null;
  name: string;
  description?: string;
  durationDays: number;
  scopes: FarmWorkflowScopeRequest[];
  /** Optional season links. The API replaces the complete set on update. */
  seasonIds?: number[];
  status?: FarmWorkflowRequestStatus;
  metadataJson?: Record<string, any>;
}

export interface FarmWorkflowResponse {
  id: number;
  domainCode: DomainCode;
  code: string;
  name: string;
  description?: string;
  durationDays: number;
  scopes: FarmWorkflowScopeResponse[];
  seasons?: FarmWorkflowSeasonRef[];
  status: FarmWorkflowResponseStatus;
  metadataJson?: Record<string, any>;
  planCount?: number;
  inProgressPlanCount?: number;
  statusBreakdown?: FarmWorkflowStatusBreakdown;
  createdAt?: string;
  updatedAt?: string;
}

export interface FarmWorkflowStatsResponse {
  totalPlans: number;
  draftPlans: number;
  inProgressPlans: number;
  completedPlans: number;
  cancelledPlans: number;
}

export interface FarmWorkflowQueryParams {
  keyword?: string;
  status?: FarmWorkflowRequestStatus | FarmWorkflowResponseStatus;
  domainCode?: DomainCode;
  page?: number;
  size?: number;
}

export interface FarmWorkflowStatsQueryParams {
  domainCode?: DomainCode;
}

export interface FarmWorkflowSummaryRef {
  id: number;
  code?: string;
  name?: string;
}

export interface FarmPlanPersonnelRequest {
  personnelId: number;
  role: FarmPlanPersonnelRole;
}

export interface FarmPlanPersonnelResponse {
  id: number;
  fullName?: string;
  code?: string;
  role: FarmPlanPersonnelRole;
}

export interface FarmSupplyItemRef {
  id: number;
  code?: string;
  sku?: string;
  name?: string;
  supplyType?: SupplyType;
}

export interface FarmPackagingVariantRef {
  id: number;
  packagingType?: FarmCatalogRef;
  unitBase?: FarmCatalogRef;
  quantity?: number;
}

export interface FarmPlanStageSupplyLineRequest {
  supplyItemId: number;
  unitBaseId?: number;
  quantity: number;
}

export interface FarmPlanStageSupplyUnitBaseRef {
  id: number;
  name: string;
  code: string;
}
export interface FarmPlanStageSupplyLineResponse {
  id: number;
  workflowId: number;
  planId: number;
  stageId: number;
  supplyItem: FarmSupplyItemRef;
  packagingVariant: FarmPackagingVariantRef;
  unitBase: FarmPlanStageSupplyUnitBaseRef;
  quantity: number;
}

export interface FarmPlanWorkItemRequest {
  taskCategoryId?: number | null;
  name: string;
  description?: string;
  headcount?: number;
  durationValue?: number;
  durationUnit?: FarmWorkDurationUnit;
}

export interface FarmPlanWorkItemResponse {
  id: number;
  workflowId: number;
  planId: number;
  stageId: number;
  taskCategory?: FarmCatalogRef | null;
  name: string;
  description?: string;
  headcount?: number;
  durationValue?: number;
  durationUnit?: FarmWorkDurationUnit;
}

export interface FarmPlanStageRequest {
  code?: string | null;
  name: string;
  description?: string;
  /** ID of the stage from a Season attached to the parent workflow. */
  seasonStageId?: number | null;
  supplyLines?: FarmPlanStageSupplyLineRequest[];
  workItems?: FarmPlanWorkItemRequest[];
}

export interface FarmPlanStageResponse {
  id: number;
  workflowId: number;
  planId: number;
  origin?: "PLANNED" | "AD_HOC";
  code?: string;
  name: string;
  description?: string;
  seasonStage?: FarmCatalogRef | null;
  supplyLines?: FarmPlanStageSupplyLineResponse[];
  workItems?: FarmPlanWorkItemResponse[];
  displayOrder?: number;
}

export interface FarmPlanRequest {
  code?: string | null;
  name: string;
  description?: string;
  purpose?: FarmPlanPurpose;
  durationDays: number;
  scopeNote?: string;
  personnel?: FarmPlanPersonnelRequest[];
  stages?: FarmPlanStageRequest[];
  status?: FarmPlanStatus;
  metadataJson?: Record<string, any>;
}

export interface FarmPlanResponse {
  id: number;
  domainCode: DomainCode;
  workflow: FarmWorkflowSummaryRef;
  code: string;
  name: string;
  description?: string;
  purpose: FarmPlanPurpose;
  durationDays: number;
  plannedStartDate?: string;
  plannedEndDate?: string;
  scopes: FarmWorkflowScopeResponse[];
  personnel?: FarmPlanPersonnelResponse[];
  stages?: FarmPlanStageResponse[];
  scopeNote?: string;
  status: FarmPlanStatus;
  metadataJson?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface FarmPlanQueryParams {
  workflowId?: number;
  keyword?: string;
  status?: FarmPlanStatus;
  domainCode?: DomainCode;
  includeAdHocStages?: boolean;
  page?: number;
  size?: number;
}

export type FarmWorkflowPageResponse = PageResponse<FarmWorkflowResponse>;
export type FarmPlanPageResponse = PageResponse<FarmPlanResponse>;
