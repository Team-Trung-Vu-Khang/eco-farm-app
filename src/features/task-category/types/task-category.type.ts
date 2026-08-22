import type { DomainCode } from "@/features/farm-supply/types";
import type { PageResponse } from "@/features/foundation/types/foundation.type";

export type TaskCategoryStatus = "active" | "inactive" | "archived";

export interface TaskCategoryRecord {
  id: number;
  domainCode: DomainCode;
  stage: string;
  code: string;
  name: string;
  example: string;
  displayOrder: number;
  status: TaskCategoryStatus;
  metadataJson: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskCategoryRequest {
  domainCode: DomainCode;
  stage: string;
  code: string;
  name: string;
  example: string;
  displayOrder: number;
  status: TaskCategoryStatus;
  metadataJson?: Record<string, unknown>;
}

export type UpdateTaskCategoryRequest = CreateTaskCategoryRequest;

export type TaskCategoryPageResponse = PageResponse<TaskCategoryRecord>;

// GET /api/master-data/task-categories/stages returns a bare string[] of
// stage names (not objects).
export type TaskCategoryStageResponse = string;

/** @deprecated Use TaskCategoryRecord. Kept for existing consumers. */
export type TaskCategoryLookupResponse = TaskCategoryRecord;

export interface TaskCategoryStageQueryParams {
  domainCode?: DomainCode;
}

export interface TaskCategoryLookupQueryParams {
  stage?: string;
  keyword?: string;
  domainCode?: DomainCode;
  status?: TaskCategoryStatus;
  page?: number;
  size?: number;
}
