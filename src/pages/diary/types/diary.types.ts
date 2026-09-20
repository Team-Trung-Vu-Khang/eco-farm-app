export interface MockWorkflowScopeItem {
  scopeType?: "REGION" | "AREA" | "PLOT";
  scopeId?: number;
  region?: { id?: number; code?: string; name?: string };
  area?: { id?: number; code?: string; name?: string };
  plot?: { id?: number; code?: string; name?: string };
}

export interface MockWorkflowItem {
  id: string | number;
  code?: string;
  name?: string;
  domainCode?: string;
  scopeType?: "REGION" | "AREA" | "PLOT";
  scopeName?: string;
  scopeId?: number;
  regionId?: number;
  areaId?: number;
  plotId?: number;
  boundary?: [number, number][];
  centerPoint?: [number, number];
  scopes?: MockWorkflowScopeItem[];
  [key: string]: any;
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

export type HistoryTabScope = "PLANNED" | "AD_HOC";
