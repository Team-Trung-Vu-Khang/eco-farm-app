import type { DomainCode } from "@/features/farm-supply/types";

export interface TaskCategoryStageResponse {
  stage: string;
  name?: string;
  code?: string;
  domainCode?: DomainCode;
}

export interface TaskCategoryLookupResponse {
  id: number;
  code?: string;
  name: string;
  stage?: string;
  domainCode?: DomainCode;
  description?: string;
}

export interface TaskCategoryStageQueryParams {
  domainCode?: DomainCode;
}

export interface TaskCategoryLookupQueryParams {
  stage?: string;
  keyword?: string;
}
