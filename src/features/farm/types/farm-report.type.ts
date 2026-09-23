// ─── Mục 2 — Geo Summary ──────────────────────────────────────────────────────

export interface GeoSummaryResponse {
  workspaceId: number;
  summary: {
    regionCount: number;
    areaCount: number;
    plotCount: number;
  };
}

// ─── Mục 3.1 — Danh sách giống (production subject variants) ─────────────────

export interface ProductionVariantItem {
  id: number;
  code: string;
  name: string;
  domainCode: string;
}

export interface ProductionVariantsQueryParams {
  domainCode?: string;
  search?: string;
  regionId?: number;
  areaId?: number;
  plotId?: number;
  page?: number;
  size?: number;
}

// ─── Mục 3.2 — Card báo cáo của đúng 1 giống ─────────────────────────────────

export interface VariantCardHealthByPlot {
  plotCode: string;
  plotName: string;
  healthyCount: number | null;
  treatingCount: number;
  diseasedCount: number | null;
  harvestedCount: number | null;
}

export interface VariantCardResponse {
  id: number;
  code: string;
  name: string;
  domainCode: string;
  cultivationScale: {
    quantity: number | null;
    unit: string | null;
  };
  totalHarvest: {
    quantityKg: number;
    changePercent: number | null;
    dataThrough: string;
  } | null;
  latestHarvest: {
    quantityKg: number;
    changePercent: number | null;
    dataThrough: string;
  } | null;
  health: {
    healthyCount: number | null;
    treatingCount: number;
    diseasedCount: number | null;
    harvestedCount: number | null;
    byPlot: VariantCardHealthByPlot[];
  };
  pendingHarvest: {
    quantity: number | null;
    unit: string | null;
    percentageOfCultivationScale: number | null;
  };
}

export interface VariantCardQueryParams {
  variantCode: string;
  domainCode: string;
  regionId?: number;
  areaId?: number;
  plotId?: number;
  /** YYYY-MM-DD, defaults to today */
  date?: string;
}

// ─── Mục 4 — Tiêu thụ vật tư nông nghiệp ────────────────────────────────────

export type SupplyType =
  | "MEDICINE"
  | "FERTILIZER"
  | "EQUIPMENT"
  | "MATERIAL"
  | "BIOLOGICAL_PRODUCT";

export type PeriodType = "MONTHLY" | "YEARLY" | "WEEKLY";

export interface SupplyUnit {
  id: number;
  code: string;
  name: string;
}

export interface SupplyConsumptionTotalEntry {
  unit: SupplyUnit;
  quantity: number | null;
  changePercent: number | null;
}

export interface SupplyConsumptionItem {
  supplyItemId: number;
  supplyItemName: string;
  unit: SupplyUnit;
  quantity: number | null;
  shareOfCategoryPercent: number | null;
  changePercent: number | null;
}

export interface SupplyConsumptionResponse {
  supplyType: SupplyType;
  periodType: PeriodType;
  dataThrough: string;
  /** Only present on page=0; each entry is a different unit group */
  totals: SupplyConsumptionTotalEntry[];
  items: {
    content: SupplyConsumptionItem[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface SupplyConsumptionQueryParams {
  supplyType: SupplyType;
  periodType?: PeriodType;
  /** YYYY-MM-DD */
  date?: string;
  comparePreviousPeriod?: boolean;
  regionId?: number;
  areaId?: number;
  plotId?: number;
  page?: number;
  size?: number;
}

// ─── Mục 5.1 — Kế hoạch sản xuất ────────────────────────────────────────────

export type FarmPlanPurpose =
  | "CULTIVATION"
  | "FACILITY_UPGRADE"
  | "TREATMENT"
  | "SOIL_IMPROVEMENT"
  | "HARVEST"
  | "NUTRITION"
  | "PLANT_CARE"
  | "PEST_DISEASE"
  | "WEED_CONTROL"
  | "IRRIGATION"
  | "OTHER";

export interface ProductionPlanItem {
  code: FarmPlanPurpose;
  totalCount: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  cancelledCount: number;
}

export interface ProductionPlanStatsResponse {
  totalCount: number;
  items: ProductionPlanItem[];
  dataThrough: string | null;
}

export interface ProductionPlanQueryParams {
  purpose?: FarmPlanPurpose;
  /** YYYY-MM-DD */
  fromDate?: string;
  /** YYYY-MM-DD */
  toDate?: string;
}

// ─── Mục 5.2 — Công việc canh tác — số liệu theo 1 tên/tab ──────────────────

export interface TaskNameStatsResponse {
  totalCount: number;
  pendingCount: number;
  inProgressCount: number;
}

export interface TaskNameStatsQueryParams {
  /** Exact task name. Omit for "all tasks". */
  name?: string;
  /** Exclude these task names (for "Khác" tab). Mutually exclusive with name. */
  excludeNames?: string[];
  domainCode?: string;
}

// ─── Mục 5.3 — Công việc canh tác — top N tên phổ biến nhất ─────────────────

export interface TaskNameRankingItem {
  name: string;
  totalCount: number;
}

export interface TaskNameRankingResponse {
  items: TaskNameRankingItem[];
  dataThrough: string | null;
}

export interface TaskNameRankingQueryParams {
  size?: number;
  domainCode?: string;
}
