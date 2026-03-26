import type { ColumnFilterOption } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type {
  AllocationItem,
  AmendmentPlan,
} from "../../../stores/useAmendmentPlanStore";
import type { Region } from "../../region-chart/constants";

export interface GeographicalSelection {
  id: string;
  type: "region" | "area" | "plot";
  regionId: string;
  areaId?: string;
  plotId?: string;
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

export interface AmendmentProcess {
  id: string;
  name: string;
  type: string;
  duration: number;
  stages: string[];
}

export interface AmendmentPlanFormData {
  code: string;
  name: string;
  technician: string;
  priority: string;
  description: string;
  seasonId: string;
  selectedRegionId: string;
  selectedZoneIds: string[];
  crop: string;
  variety: string;
  selectedPlotIds: string[];
  currentPH: string;
  targetPH: string;
  targetIssue: string;
  purpose: "amendment" | "treatment";
  processId: string;
  regimenId: string;
  selectedStages: string[];
  allocations: AllocationItem[];
  startDate: string;
  endDate: string;
  budget: string;
}

export interface AmendmentPlanFormContext {
  formData: AmendmentPlanFormData;
  selections: GeographicalSelection[];
  selectedEnterpriseId: string;
}

export interface StatusConfig {
  label: string;
  variant: "default" | "destructive" | "outline" | "secondary";
  className: string;
}

export interface AmendmentPlanPageStats {
  planning: number;
  inProgress: number;
  completed: number;
  totalArea: string;
}

export interface AmendmentPlanPageState {
  plans: AmendmentPlan[];
  stats: AmendmentPlanPageStats;
  viewMode: "list" | "calendar";
  deleteOpen: boolean;
  detailOpen: boolean;
  selectedItem: AmendmentPlan | null;
  tableFilters: {
    key: keyof AmendmentPlan;
    label: string;
    options: ColumnFilterOption[];
  }[];
}

export type SoilAmendmentRegion = Region;
