import type { SupplyType } from "@/features/farm-supply/types";

export interface MaterialAllocation {
  id: number;
  stageId: string;
  supplyType?: SupplyType;
  materialCategory: string;
  materialType: string;
  materialName: string;
  quantity: string;
  unit: string;
  cycle?: string;
  packaging?: string;
  // Real supply-item catalog id, required to build FarmPlanStageSupplyLineRequest.
  supplyItemId?: number;
  // Real unit-base catalog id (from the selected packaging variant's unitBase),
  // required to build FarmPlanStageSupplyLineRequest.
  unitBaseId?: number;
}

export interface TaskAllocation {
  id: number;
  stageId: string;
  name: string;
  description: string;
  labor: string;
  duration: string;
  geographicalSelections?: GeographicalSelection[];
  isRepeating?: boolean;
  repeatDays?: number[];
  repeatWeeks?: number;
  repeatDates?: string[];
  startDate?: string;
  endDate?: string;
  // Real task-category catalog id (from /api/master-data/task-categories),
  // plus the numeric fields the FarmPlanWorkItemRequest API expects — kept
  // alongside the free-text `labor`/`duration` display fields above.
  taskCategoryId?: number;
  headcount?: number;
  durationValue?: number;
  durationUnit?: "MINUTE" | "HOUR" | "DAY" | "WEEK";
}

export interface GeographicalSelection {
  id: string;
  type: "region" | "area" | "plot";
  regionId: string;
  areaId?: string;
  plotId?: string;
}

export interface GrowthCycleSelection {
  id: string;
  type: "cycle" | "stage";
  cycleId: string;
  stageId?: string;
  stageName?: string;
}

export interface Plan {
  id: number;
  code: string;
  name: string;
  description: string;
  scopeNote?: string;
  workflowId?: string;
  seasonId: string;
  seasonName: string;
  startDate: string;
  endDate: string;
  // Total planned duration in days, straight from the API's
  // FarmPlanResponse.durationDays — the source of truth for display, since
  // startDate/endDate are often unset on a freshly created draft plan.
  durationDays?: number;
  selectedRegionIds: string[];
  selectedZoneIds: string[];
  selectedPlotIds: string[];
  crop: string;
  variety: string;
  purpose:
    | "cultivation"
    | "facility-upgrade"
    | "treatment"
    | "amendment"
    | "harvest"
    | "incurred";
  zone?: string;
  cultivationRegion?: string;
  plot?: string;
  area?: string;
  expectedYield?: string;
  growthCycleId: string;
  // Growth cycle stage(s) picked for this plan, within the growth cycle
  // inherited from the parent workflow — local-only, not persisted by the
  // backend plan API yet.
  growthCycleSelections?: GrowthCycleSelection[];
  /** Season-stage IDs returned by the plan API, kept for edit hydration. */
  seasonStageIds?: number[];
  /** Names of only the API stages linked to a Season, for workflow display. */
  seasonStageNames?: string[];
  regimenId?: string;
  selectedStages: string[];
  materialAllocations: MaterialAllocation[];
  taskAllocations: TaskAllocation[];
  status: "draft" | "active" | "completed" | "cancelled";
  createdAt: string;
  scopes?: GeographicalSelection[];
  // Pre-grouped, human-readable version of `scopes` straight from the API's
  // embedded region/area/plot names — unlike `scopes`, it doesn't need a
  // matching entry in the (mock) region tree to display correctly.
  selectionSummary?: SelectionSummaryGroup[];
  personnel?: PlanPersonnel[];
  // Free-form metadata from the API. `parentId` links this plan to the plan
  // node it branched off from in the workflow canvas (see
  // PlanGrowthCreateWorkflowPage) — the canvas graph is otherwise
  // local-draft-only and doesn't survive a reload from the backend.
  metadataJson?: Record<string, any>;
}

export interface PlanPersonnel {
  id: number;
  fullName: string;
  role: "MANAGER" | "QUALITY_INSPECTOR";
}

export type PlanStatus = Plan["status"];

export interface Workflow {
  id: string;
  name: string;
  description: string;
  selections: GeographicalSelection[];
  seasonIds?: number[];
  seasonNames?: string[];
  isActive: boolean;
  createdAt: string;
  nodes?: unknown[];
  edges?: unknown[];
  planCount?: number;
  statusBreakdown?: {
    draft?: number;
    inProgress?: number;
    completed?: number;
    cancelled?: number;
  };
}

export interface PlanFormData {
  code: string;
  name: string;
  description: string;
  scopeNote: string;
  seasonId: string;
  seasonName: string;
  startDate: string;
  endDate: string;
  plannedDurationYears: string;
  plannedDurationMonths: string;
  plannedDurationDays: string;
  managementPersonnelIds: string[];
  qualityInspectorPersonnelIds: string[];
  selectedRegionIds: string[];
  selectedZoneIds: string[];
  selectedPlotIds: string[];
  crop: string;
  variety: string;
  purpose: Plan["purpose"];
  growthCycleId: string;
  growthCycleSelections: GrowthCycleSelection[];
  regimenId: string;
  selectedStages: string[];
  status: Plan["status"];
  materialAllocations: MaterialAllocation[];
  taskAllocations: TaskAllocation[];
}

export interface SelectionSummaryItem {
  type: "region" | "area" | "plot";
  id: string;
  name: string;
  parentName?: string;
}

export interface SelectionSummaryGroup {
  regionId: string;
  regionName: string;
  items: SelectionSummaryItem[];
}
