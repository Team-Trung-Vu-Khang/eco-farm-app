export interface AdminWorkspaceGroupStats {
  count: number;
  totalAcreageHa: number;
}

export interface AdminWorkspaceStatsResponse {
  enterprise: AdminWorkspaceGroupStats;
  cooperative: AdminWorkspaceGroupStats;
  farmHousehold: AdminWorkspaceGroupStats;
  unassigned: AdminWorkspaceGroupStats;
}

export interface ActiveFarmerItem {
  rank: number | null;
  workspaceId: number;
  code?: string;
  name: string;
  province?: string | null;
  district?: string | null;
  ward?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  organizationType?: string;
  active: boolean;
  diaryCount: number;
  supplyEntryCount?: number;
  activeDays: number;
  lastActiveDate?: string | null;
  latestDiaryType?: "DAILY" | "PLAN_TASK" | null;
  latestDiaryId?: string | null;
  latestDiary?: any;
  entriesPerWeek?: number;
}

export interface ActiveFarmersSummary {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  activePercent: number;
}

export interface ActiveFarmersCriteria {
  minActiveDays: number;
  minSupplyEntries: number;
}

export interface ActiveFarmersReportResponse {
  month: string;
  summary: ActiveFarmersSummary;
  criteria: ActiveFarmersCriteria;
  dataThrough: string | null;
  items: ActiveFarmerItem[];
}

export interface ActiveFarmersWorkspacesResponse {
  month: string;
  status: string;
  page: number;
  size: number;
  totalElements: number;
  items: ActiveFarmerItem[];
}

export interface ExportColumnConfig {
  key: string;
  header: string;
}

export interface CreateExportJobPayload {
  month?: string;
  status?: "ACTIVE" | "INACTIVE";
  limit?: number;
  format: "csv" | "xlsx";
  fileName?: string;
  columns: ExportColumnConfig[];
  i18n?: Record<string, string>;
}

export interface ExportJobResponse {
  id: string;
  module?: string;
  status: "PENDING" | "PROCESSING" | "DONE" | "FAILED";
  format?: string;
  fileName?: string;
  fileUrl?: string | null;
  totalRows?: number;
  processedRows?: number;
  progressPercent?: number;
  errorMessage?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface HarvestPeriod {
  from: string;
  toExclusive: string;
  dataThrough: string | null;
}

export interface HarvestByVariantItem {
  domainCode: string;
  groupKey: string;
  variantCode: string | null;
  groupLabel: string;
  quantityTon: number;
  percentage: number;
}

export interface HarvestByVariantResponse {
  period: HarvestPeriod;
  totalTon: number;
  unresolvedCount: number;
  items: HarvestByVariantItem[];
}

export interface MonthlyHarvestBucket {
  bucketStart: string;
  quantityTon: number;
}

export interface TopFarmerHarvestDetail {
  rank: number;
  workspaceId: number;
  code?: string;
  name: string;
  province?: string | null;
  acreageHa: number | null;
  yieldTonPerHa: number | null;
  quantityTon: number;
  percentage: number;
  monthly: MonthlyHarvestBucket[];
}

export interface HarvestByVariantDetailResponse {
  variantCode: string;
  variantName: string;
  domainCode: string;
  period: HarvestPeriod;
  totalAcreageHa: number | null;
  participatingCount: number;
  quantityTon: number;
  unresolvedCount: number;
  topFarmers: TopFarmerHarvestDetail[];
}
