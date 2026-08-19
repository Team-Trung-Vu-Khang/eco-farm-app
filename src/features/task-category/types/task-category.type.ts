import type { DomainCode } from "@/features/farm-supply/types";

// GET /api/master-data/task-categories/stages returns a bare string[] of
// stage names (not objects).
export type TaskCategoryStageResponse = string;

export interface TaskCategoryLookupResponse {
  id: number;
  code?: string;
  name: string;
  stage?: string;
  domainCode?: DomainCode;
}

export interface TaskCategoryStageQueryParams {
  domainCode?: DomainCode;
}

export interface TaskCategoryLookupQueryParams {
  stage?: string;
  keyword?: string;
  domainCode?: DomainCode;
  page?: number;
  size?: number;
}
