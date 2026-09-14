export interface MockWorkflowItem {
  id: string;
  code: string;
  name: string;
  domainCode: string;
  scopeType?: "REGION" | "AREA" | "PLOT";
  scopeName?: string;
  boundary?: [number, number][];
  centerPoint?: [number, number];
  scopes?: unknown[];
}

export interface MockPlanItem {
  id: string;
  workflowId: string;
  code: string;
  name: string;
  objective?: string;
}

export interface MockTaskSupplyLine {
  id: number;
  name: string;
  plannedQty: string;
  actualQty?: string;
  unit: string;
  supplyItemName?: string;
  supplyItem?: { id?: number; name?: string; code?: string };
}

export interface MockTaskItem {
  id: string;
  planId: string;
  code: string;
  name: string;
  workType: string;
  startDate: string;
  endDate: string;
  taskCategory?: "Dự kiến" | "Phát sinh";
  lastCompletionPercentage?: number;
  updatedCount?: number;
  remainingPercentage?: number;
  priority?: string;
  description?: string;
  objective?: string;
  manager?: {
    name: string;
    role: string;
  };
  inspector?: {
    name: string;
    role: string;
  };
  supplyLines?: MockTaskSupplyLine[];
}

export interface SupplyActualRecord {
  id: number;
  name: string;
  plannedQty?: string;
  actualQty: string;
  unit: string;
  supplyItemName?: string;
  supplyItem?: { id?: number; name?: string; code?: string };
}

export interface HarvestRecord {
  id: string | number;
  targetLabel: string;
  quantity: string;
  unit: string;
}

export interface PhotoObjectRecord {
  objectKey?: string;
  fileUrl: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  thumbnailUrl?: string;
}

export interface UpdateLogEntry {
  id: string | number;
  updatedAt: string;
  updaterName: string;
  updaterRole?: string;
  completionPercent?: number;
  status: "DOING" | "COMPLETED" | "TODO";
  note: string;
  supplies?: SupplyActualRecord[];
  harvestDetails?: HarvestRecord[];
  images?: string[];
  photoObjects?: PhotoObjectRecord[];
}

export interface TaskHistoryItem {
  id: string | number;
  taskCode: string;
  taskName: string;
  origin: "PLANNED" | "AD_HOC";
  workflowCode?: string;
  workflowName?: string;
  workflowId?: number | string;
  planCode?: string;
  planName?: string;
  planId?: number | string;
  taskCategoryName?: string;
  latestUpdate: UpdateLogEntry;
  historyLogs: UpdateLogEntry[];
}
