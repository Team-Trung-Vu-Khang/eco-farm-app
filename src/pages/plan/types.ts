import type {
  MaterialAllocation as StoreMaterialAllocation,
  Plan,
  TaskAllocation as StoreTaskAllocation,
} from "../../stores/usePlanStore";

export interface GeographicalSelection {
  id: string;
  type: "region" | "area" | "plot";
  regionId: string;
  areaId?: string;
  plotId?: string;
}

export interface MaterialAllocation extends StoreMaterialAllocation {
  taskId?: number;
  // Only present when picked from the plan's own supply catalog — matches
  // FarmTaskRequest.supplyLines' shape so it can be submitted directly.
  supplyItemId?: number;
  unitBaseId?: number;
}

export interface TaskAllocation extends StoreTaskAllocation {
  geographicalSelections?: GeographicalSelection[];
  startDate?: string;
  endDate?: string;
  isRepeating?: boolean;
  repeatDays?: number[];
  repeatWeeks?: number;
}

export type PlanPurpose = Plan["purpose"];
export type PlanStatus = Plan["status"];

export interface PlanFormData {
  code: string;
  name: string;
  description: string;
  seasonId: string;
  seasonName: string;
  startDate: string;
  endDate: string;
  selectedRegionIds: string[];
  selectedZoneIds: string[];
  selectedPlotIds: string[];
  crop: string;
  variety: string;
  purpose: PlanPurpose;
  growthCycleId: string;
  regimenId: string;
  selectedStages: string[];
  status: PlanStatus;
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
