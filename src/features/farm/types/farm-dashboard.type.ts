export type SupplyTypeKey = "medicine" | "fertilizer" | "material" | "equipment";

export interface LowStockCountByType {
  medicine: number;
  fertilizer: number;
  material: number;
  equipment: number;
}

export interface LowStockSuppliesResponse {
  workspaceId: number;
  totalLowStock: number;
  countByType: LowStockCountByType;
  topShortageType: SupplyTypeKey | null;
  topShortageCount: number;
}

export interface ExpiringContractsResponse {
  workspaceId: number;
  expiringCount: number;
  windowDays: number;
}

export interface ProductionHealthSummary {
  totalCount: number;
  healthyCount: number;
  pestCount: number;
  treatingCount: number;
  computedAt: string;
}

export interface ProductionHealthResponse {
  workspaceId: number;
  summary: ProductionHealthSummary | null;
}

export interface HarvestPoint {
  bucketStart: string;
  quantityTon?: number;
  quantityKg?: number;
}

export interface HarvestProductionSeries {
  domainCode: string;
  groupKey: string;
  groupLabel: string;
  points: HarvestPoint[];
}

export interface HarvestProductionResponse {
  workspaceId: number;
  periodType: "MONTHLY" | "YEARLY";
  series: HarvestProductionSeries[] | null;
}

export interface HarvestProductionQueryParams {
  periodType?: "MONTHLY" | "YEARLY";
  fromDate?: string;
  toDate?: string;
}
