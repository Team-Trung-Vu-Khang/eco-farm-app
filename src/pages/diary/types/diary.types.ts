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

export type HistoryTabScope = "PLANNED" | "AD_HOC";
