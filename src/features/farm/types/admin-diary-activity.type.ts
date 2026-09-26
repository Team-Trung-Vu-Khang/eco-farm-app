export interface AdminDiaryActivityCriteria {
  minActiveDays: number;
  minSupplyEntries: number;
}

export interface AdminDiaryActivityMetric {
  count: number;
  percent: number;
}

export interface AdminDiaryActivitySummaryResponse {
  month: string;
  dataThrough: string | null;
  criteria: AdminDiaryActivityCriteria;
  totalCount: number;
  active: AdminDiaryActivityMetric;
  evidence: AdminDiaryActivityMetric;
}

export type AdminWorkspaceStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export interface AdminDiaryWorkspaceItem {
  workspaceId: number;
  code: string;
  name: string;
  organizationType: "ENTERPRISE" | "COOPERATIVE" | "FARM_HOUSEHOLD" | null;
  status: AdminWorkspaceStatus;
  activeDays: number;
  diaryCount: number;
  supplyEntryCount: number;
  evidenceCount: number;
  hasEvidence: boolean;
  active: boolean;
  lastActiveDate: string | null;
}

export interface AdminDiaryWorkspacesQueryParams {
  month?: string;
  keyword?: string;
  status?: AdminWorkspaceStatus;
  page?: number;
  size?: number;
}

export interface AdminDiaryWorkspacesPageResponse {
  month: string;
  content: AdminDiaryWorkspaceItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
