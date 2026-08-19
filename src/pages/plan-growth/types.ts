export interface MaterialAllocation {
  id: number;
  stageId: string;
  materialCategory: string;
  materialType: string;
  materialName: string;
  quantity: string;
  unit: string;
  cycle?: string;
  packaging?: string;
  // Real supply-item catalog id. NOTE: the FarmPlanStageSupplyLineRequest
  // API also requires a packagingVariantId, but the supply catalog's
  // packaging variants (PackagingVariantResponse) carry no id — only
  // packagingType/unitBase/quantity — so this line can't be sent to the
  // plan-update API yet. Kept here for when the backend exposes one.
  supplyItemId?: number;
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
