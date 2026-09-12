import type { PageResponse } from "@/features/foundation/types/foundation.type";
import type {
  PhotoRequest,
  PhotoResponse,
  HarvestItemRequest,
  HarvestItemResponse,
  SupplyUsageRequest,
  SupplyUsageResponse,
  FarmPlanPurpose,
} from "@/features/farm-daily-diary/types/farm-daily-diary.type";

export interface ExecutorProgressRequest {
  personnelId: number;
  progressPercent: number;
}

export interface ExecutorProgressResponse {
  personnelId: number;
  personnelFullName?: string | null;
  progressPercent: number;
}

export interface PlanTaskDiaryLineRequest {
  taskId?: number | null;
  description: string;
  endDate: string;
  progressPercent?: number | null;
  executorProgress?: ExecutorProgressRequest[] | null;
  supplies?: SupplyUsageRequest[] | null;
}

export interface TaskSnapshotRef {
  id: number;
  code: string;
  name: string;
}

export interface PlanTaskDiaryLineResponse {
  id?: number;
  taskId: number;
  task?: TaskSnapshotRef | null;
  taskCode?: string | null;
  taskName?: string | null;
  description: string;
  endDate: string;
  progressPercent?: number | null;
  executorProgress?: ExecutorProgressResponse[] | null;
  supplies?: SupplyUsageResponse[] | null;
}

export interface SubmittedByPersonnelRef {
  id: number;
  fullName?: string | null;
}

export interface WorkflowSnapshotRef {
  id: number;
  code: string;
  name: string;
}

export interface PlanSnapshotRef {
  id: number;
  code: string;
  name: string;
}

export interface StageSnapshotRef {
  id: number;
  name: string;
}

export interface CreatePlanTaskDiaryEntryRequest {
  planId: number;
  stageId: number;
  workflowId?: number | null;
  seasonId?: number | null;
  submittedByPersonnelId?: number | null;
  description?: string | null;
  photos?: PhotoRequest[] | null;
  lines: PlanTaskDiaryLineRequest[];
  harvestItems?: HarvestItemRequest[] | null;
}

export interface UpdatePlanTaskDiaryEntryRequest {
  planId?: number;
  stageId?: number;
  workflowId?: number | null;
  seasonId?: number | null;
  submittedByPersonnelId?: number | null;
  description?: string | null;
  photos?: PhotoRequest[] | null;
  lines?: PlanTaskDiaryLineRequest[] | null;
  harvestItems?: HarvestItemRequest[] | null;
}

export interface PlanTaskDiaryEntryResponse {
  id: number;
  code: string;
  workspaceId: number;
  workflowId?: number | null;
  workflow?: WorkflowSnapshotRef | null;
  seasonId?: number | null;
  planId: number;
  plan?: PlanSnapshotRef | null;
  stageId: number;
  stage?: StageSnapshotRef | null;
  purpose?: FarmPlanPurpose | null;
  hasEvidence?: boolean;
  submittedByPersonnel?: SubmittedByPersonnelRef | null;
  description?: string | null;
  createdByUserId?: number | null;
  createdAt: string;
  photos?: PhotoResponse[] | null;
  lines: PlanTaskDiaryLineResponse[];
  harvestItems?: HarvestItemResponse[] | null;
  editable?: boolean;
  editableUntil?: string | null;
}

export type PlanTaskDiaryEntryPageResponse =
  PageResponse<PlanTaskDiaryEntryResponse>;

export interface PlanTaskDiaryStatsResponse {
  totalUpdates: number;
  withEvidence: number;
  withoutEvidence: number;
  latestUpdatedAt: string | null;
}

export interface PlanTaskDiaryQueryParams {
  page?: number;
  size?: number;
  keyword?: string;
  workflowId?: number;
  planId?: number;
  stageId?: number;
  seasonId?: number;
  taskId?: number;
  purpose?: FarmPlanPurpose | FarmPlanPurpose[];
  fromDate?: string;
  toDate?: string;
}

