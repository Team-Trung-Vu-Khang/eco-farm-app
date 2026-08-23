import type { DomainCode } from "@/features/farm-supply/types";
import type { PageResponse } from "@/features/foundation/types/foundation.type";
import type {
  FarmCatalogRef,
  FarmPlanPersonnelRole,
  FarmSupplyItemRef,
  FarmWorkflowAreaRef,
  FarmWorkflowPlotRef,
  FarmWorkflowRegionRef,
  FarmWorkflowScopeType,
  FarmWorkflowSummaryRef,
} from "@/features/farm-workflow/types/farm-workflow.type";

export type FarmTaskOrigin = "PLANNED" | "AD_HOC";
export type FarmTaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type FarmTaskStatus = "TODO" | "DOING" | "DONE" | "CANCELLED";
export type FarmTaskRecurrenceRepeatMode = "NONE" | "SPECIFIC_DATES";
export type FarmTaskPersonnelRole = FarmPlanPersonnelRole;

export interface FarmTaskPersonnelRequest {
  personnelId: number;
  role: FarmTaskPersonnelRole;
}

export interface FarmTaskPersonnelResponse {
  id: number;
  fullName?: string;
  role: FarmTaskPersonnelRole;
}

export interface FarmTaskRecurrenceRequest {
  repeatMode: FarmTaskRecurrenceRepeatMode;
  repeatDates: string[] | null;
}

export interface FarmTaskRecurrenceResponse {
  repeatMode: FarmTaskRecurrenceRepeatMode;
  repeatDates: string[] | null;
}

export interface FarmTaskSupplyLineRequest {
  supplyItemId: number;
  unitBaseId: number;
  quantity: number;
}

export interface FarmTaskSupplyUnitBaseRef {
  id: number;
  code: string;
  name: string;
}

export interface FarmTaskSupplyLineResponse {
  id: number;
  supplyItem: FarmSupplyItemRef;
  unitBase: FarmTaskSupplyUnitBaseRef;
  quantity: number;
  displayOrder: number;
}

export interface FarmTaskSourceWorkItemRef {
  id: number;
  name: string;
}

export interface FarmTaskPlanRef {
  id: number;
  code: string;
  name: string;
}

export interface FarmTaskRequest {
  origin: FarmTaskOrigin;
  workflowId?: number | null;
  planId?: number | null;
  scopeType?: FarmWorkflowScopeType | null;
  scopeId?: number | null;
  sourceWorkItemId?: number | null;
  taskCategoryId?: number | null;
  name: string;
  priority?: FarmTaskPriority;
  note?: string | null;
  personnel?: FarmTaskPersonnelRequest[];
  startDate: string;
  endDate: string;
  recurrence?: FarmTaskRecurrenceRequest | null;
  supplyLines?: FarmTaskSupplyLineRequest[];
  status?: FarmTaskStatus | null;
}

export interface FarmTaskBulkCreateRequest {
  tasks: FarmTaskRequest[];
}

export interface FarmTaskResponse {
  id: number;
  code: string;
  name: string;
  origin: FarmTaskOrigin;
  parent: FarmTaskParentRef | null;
  domainCode: DomainCode;
  workflow: FarmWorkflowSummaryRef;
  plan: FarmTaskPlanRef | null;
  scopeType: FarmWorkflowScopeType | null;
  region: FarmWorkflowRegionRef | null;
  area: FarmWorkflowAreaRef | null;
  plot: FarmWorkflowPlotRef | null;
  sourceWorkItem: FarmTaskSourceWorkItemRef | null;
  taskCategory: FarmCatalogRef | null;
  priority: FarmTaskPriority;
  note: string | null;
  personnel: FarmTaskPersonnelResponse[];
  startDate: string;
  endDate: string;
  durationDays: number;
  spawnedChildCount: number | null;
  recurrence: FarmTaskRecurrenceResponse;
  supplyLines: FarmTaskSupplyLineResponse[];
  status: FarmTaskStatus;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FarmTaskParentRef {
  id: number;
  code?: string;
  name?: string;
}

export interface FarmTaskQueryParams {
  origin?: FarmTaskOrigin;
  planId?: number | string;
  domainCode?: DomainCode;
  status?: FarmTaskStatus;
  priority?: FarmTaskPriority;
  assignedPersonnelId?: number | string;
  keyword?: string;
  fromDate?: string;
  toDate?: string;
  parentTaskId?: number | string;
  page?: number;
  size?: number;
}

export interface FarmTaskStatsQueryParams {
  origin?: FarmTaskOrigin;
  planId?: number | string;
  domainCode?: DomainCode;
  priority?: FarmTaskPriority;
  assignedPersonnelId?: number | string;
  keyword?: string;
  fromDate?: string;
  toDate?: string;
}

export interface FarmTaskStatsResponse {
  totalTasks: number;
  todoTasks: number;
  doingTasks: number;
  doneTasks: number;
  cancelledTasks: number;
}

export type FarmTaskPageResponse = PageResponse<FarmTaskResponse>;

export interface FarmTaskCalendarPreview {
  taskId: number;
  code: string;
  name: string;
  priority: FarmTaskPriority;
  status: FarmTaskStatus;
}

export interface FarmTaskCalendarEntry {
  total: number;
  preview: FarmTaskCalendarPreview[];
}

export interface FarmTaskCalendarQueryParams
  extends Omit<FarmTaskQueryParams, "page" | "size"> {
  fromDate: string;
  toDate: string;
  previewLimit?: number;
}

export interface FarmTaskCalendarDayQueryParams
  extends Omit<FarmTaskQueryParams, "fromDate" | "toDate"> {
  page?: number;
  size?: number;
}

export interface FarmTaskCalendarDayItem extends FarmTaskCalendarPreview {}

export type FarmTaskCalendarResponse = Record<string, FarmTaskCalendarEntry>;
export type FarmTaskCalendarDayResponse = PageResponse<FarmTaskCalendarDayItem>;
