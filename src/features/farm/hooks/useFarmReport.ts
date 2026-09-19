import { useQuery } from "@tanstack/react-query";
import { farmReportApi } from "../api/farm-report.api";
import type {
  ProductionVariantsQueryParams,
  VariantCardQueryParams,
  SupplyConsumptionQueryParams,
  ProductionPlanQueryParams,
  TaskNameStatsQueryParams,
  TaskNameRankingQueryParams,
} from "../types/farm-report.type";

/** Cache TTL khớp với TTL Redis BE = 5 phút */
const STALE_TIME = 5 * 60 * 1000;

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const farmReportKeys = {
  all: () => ["farm", "report"] as const,
  geoSummary: () => ["farm", "report", "geo-summary"] as const,
  variants: (params: ProductionVariantsQueryParams) =>
    ["farm", "report", "variants", params] as const,
  variantCard: (params: VariantCardQueryParams) =>
    ["farm", "report", "variant-card", params] as const,
  supply: (params: SupplyConsumptionQueryParams) =>
    ["farm", "report", "supply", params.supplyType, params] as const,
  planStats: (params?: ProductionPlanQueryParams) =>
    ["farm", "report", "plan-stats", params ?? {}] as const,
  taskRanking: (params?: TaskNameRankingQueryParams) =>
    ["farm", "report", "task-ranking", params ?? {}] as const,
  taskStats: (params?: TaskNameStatsQueryParams) =>
    ["farm", "report", "task-stats", params ?? {}] as const,
};

// ─── Mục 2 — Geo Summary ─────────────────────────────────────────────────────

export function useGeoSummary() {
  const query = useQuery({
    queryKey: farmReportKeys.geoSummary(),
    queryFn: farmReportApi.getGeoSummary,
    staleTime: STALE_TIME,
  });

  return {
    ...query,
    regionCount: query.data?.summary.regionCount ?? null,
    areaCount: query.data?.summary.areaCount ?? null,
    plotCount: query.data?.summary.plotCount ?? null,
  };
}

// ─── Mục 3.1 — Danh sách giống ───────────────────────────────────────────────

export function useProductionVariants(params: ProductionVariantsQueryParams) {
  const query = useQuery({
    queryKey: farmReportKeys.variants(params),
    queryFn: () => farmReportApi.getProductionVariants(params),
    staleTime: STALE_TIME,
  });

  return {
    ...query,
    items: query.data?.content ?? [],
    total: query.data?.totalElements ?? 0,
    totalPages: query.data?.totalPages ?? 0,
  };
}

// ─── Mục 3.2 — Card báo cáo 1 giống ─────────────────────────────────────────

export function useVariantCard(params: VariantCardQueryParams) {
  return useQuery({
    queryKey: farmReportKeys.variantCard(params),
    queryFn: () => farmReportApi.getVariantCard(params),
    staleTime: STALE_TIME,
    enabled: !!params.variantCode && !!params.domainCode,
  });
}

// ─── Mục 4 — Tiêu thụ vật tư ─────────────────────────────────────────────────

export function useSupplyConsumption(params: SupplyConsumptionQueryParams) {
  return useQuery({
    queryKey: farmReportKeys.supply(params),
    queryFn: () => farmReportApi.getSupplyConsumption(params),
    staleTime: STALE_TIME,
    enabled: !!params.supplyType,
  });
}

// ─── Mục 5.1 — Kế hoạch sản xuất ─────────────────────────────────────────────

export function useProductionPlanStats(params?: ProductionPlanQueryParams) {
  const query = useQuery({
    queryKey: farmReportKeys.planStats(params),
    queryFn: () => farmReportApi.getProductionPlanStats(params),
    staleTime: STALE_TIME,
  });

  return {
    ...query,
    totalCount: query.data?.totalCount ?? 0,
    items: query.data?.items ?? [],
    dataThrough: query.data?.dataThrough ?? null,
  };
}

// ─── Mục 5.3 — Task Ranking ───────────────────────────────────────────────────

export function useTaskNameRanking(params?: TaskNameRankingQueryParams) {
  const query = useQuery({
    queryKey: farmReportKeys.taskRanking(params),
    queryFn: () => farmReportApi.getTaskNameRanking(params),
    staleTime: STALE_TIME,
  });

  return {
    ...query,
    items: query.data?.items ?? [],
    dataThrough: query.data?.dataThrough ?? null,
  };
}

// ─── Mục 5.2 — Task Stats (1 tab) ────────────────────────────────────────────

export function useTaskNameStats(params?: TaskNameStatsQueryParams) {
  const query = useQuery({
    queryKey: farmReportKeys.taskStats(params),
    queryFn: () => farmReportApi.getTaskNameStats(params),
    staleTime: STALE_TIME,
  });

  return {
    ...query,
    totalCount: query.data?.totalCount ?? 0,
    pendingCount: query.data?.pendingCount ?? 0,
    inProgressCount: query.data?.inProgressCount ?? 0,
  };
}
