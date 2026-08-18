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
