export interface MaterialAllocation {
  id: number;
  stageId: string;
  materialType: string;
  materialName: string;
  quantity: string;
  actualQuantity?: string;
  unit: string;
  supplyItemId?: number;
  unitBaseId?: number;
  isPlanned?: boolean;
}

export interface HarvestDetail {
  id: string;
  targetId: string | number;
  targetLabel: string;
  codeName: string;
  quantity: string;
  unitBase: string;
}

export interface CropSubjectVariantItem {
  id: string | number;
  linkId?: number;
  variantId: number;
  code: string;
  name: string;
  productionSubjectName?: string;
  sourceType?: "FOUNDATION" | "OWNER";
  zoneId?: number | string;
  zoneName?: string;
  regionName?: string;
}


export interface HistoryFormData {
  regimenId: string;
  workType: string;
  harvestScope: "region" | "crop";
  harvestTargets: string[];
  harvestDetails: HarvestDetail[];
  harvestFiles: File[];
  startDate: string;
  endDate: string;
  completionPercentage: number;
  description: string;
  images: File[];
  selectedStages: string[];
  materialAllocations: MaterialAllocation[];
}

export interface HistoryFormContentProps {
  isPlannedModeDefault?: boolean;
  allowModeToggle?: boolean;
  initialTaskId?: string;
  initialPlanId?: string;
  initialWorkflowId?: string;
  pageTitle?: string;
  backUrl?: string;
}

export interface RawSupplyLineItem {
  id: number;
  supplyItem?: { name: string };
  name?: string;
  quantity?: number;
  plannedQty?: number | string;
  actualQty?: number | string;
  unitBase?: { name: string };
  unit?: string;
}
