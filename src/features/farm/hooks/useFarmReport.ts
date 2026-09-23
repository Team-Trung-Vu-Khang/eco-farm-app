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

export interface ReportHookOptions {
  workspaceId?: number | string | null;
  enabled?: boolean;
}

// ─── Query Key Factory ────────────────────────────────────────────────────────

export const farmReportKeys = {
  all: (wsId?: number | string | null) => ["farm", "report", wsId] as const,
  geoSummary: (wsId?: number | string | null) =>
    ["farm", "report", "geo-summary", wsId] as const,
  variants: (
    params: ProductionVariantsQueryParams,
    wsId?: number | string | null,
  ) => ["farm", "report", "variants", params, wsId] as const,
  variantCard: (
    params: VariantCardQueryParams,
    wsId?: number | string | null,
  ) => ["farm", "report", "variant-card", params, wsId] as const,
  supply: (
    params: SupplyConsumptionQueryParams,
    wsId?: number | string | null,
  ) => ["farm", "report", "supply", params.supplyType, params, wsId] as const,
  planStats: (
    params?: ProductionPlanQueryParams,
    wsId?: number | string | null,
  ) => ["farm", "report", "plan-stats", params ?? {}, wsId] as const,
  taskRanking: (
    params?: TaskNameRankingQueryParams,
    wsId?: number | string | null,
  ) => ["farm", "report", "task-ranking", params ?? {}, wsId] as const,
  taskStats: (
    params?: TaskNameStatsQueryParams,
    wsId?: number | string | null,
  ) => ["farm", "report", "task-stats", params ?? {}, wsId] as const,
};

// ─── Mục 2 — Geo Summary ─────────────────────────────────────────────────────

export function useGeoSummary(options?: ReportHookOptions) {
  const wsId = options?.workspaceId;
  const query = useQuery({
    queryKey: farmReportKeys.geoSummary(wsId),
    queryFn: () => farmReportApi.getGeoSummary(wsId),
    staleTime: STALE_TIME,
    enabled: options?.enabled !== false,
  });

  return {
    ...query,
    regionCount: query.data?.summary.regionCount ?? null,
    areaCount: query.data?.summary.areaCount ?? null,
    plotCount: query.data?.summary.plotCount ?? null,
  };
}

// ─── Mục 3.1 — Danh sách giống ───────────────────────────────────────────────

export function useProductionVariants(
  params: ProductionVariantsQueryParams,
  options?: ReportHookOptions,
) {
  const wsId = options?.workspaceId;
  const query = useQuery({
    queryKey: farmReportKeys.variants(params, wsId),
    queryFn: () => farmReportApi.getProductionVariants(params, wsId),
    staleTime: STALE_TIME,
    enabled: options?.enabled !== false,
  });

  return {
    ...query,
    items: query.data?.content ?? [],
    total: query.data?.totalElements ?? 0,
    totalPages: query.data?.totalPages ?? 0,
  };
}

// ─── Mục 3.2 — Card báo cáo 1 giống ─────────────────────────────────────────

export function useVariantCard(
  params: VariantCardQueryParams,
  options?: ReportHookOptions,
) {
  const wsId = options?.workspaceId;
  return useQuery({
    queryKey: farmReportKeys.variantCard(params, wsId),
    queryFn: () => farmReportApi.getVariantCard(params, wsId),
    staleTime: STALE_TIME,
    enabled: !!params.variantCode && !!params.domainCode && options?.enabled !== false,
  });
}

// ─── Mục 4 — Tiêu thụ vật tư ─────────────────────────────────────────────────

export function useSupplyConsumption(
  params: SupplyConsumptionQueryParams,
  options?: ReportHookOptions,
) {
  const wsId = options?.workspaceId;
  return useQuery({
    queryKey: farmReportKeys.supply(params, wsId),
    queryFn: () => farmReportApi.getSupplyConsumption(params, wsId),
    staleTime: STALE_TIME,
    enabled: !!params.supplyType && options?.enabled !== false,
  });
}

// ─── Mục 5.1 — Kế hoạch sản xuất ─────────────────────────────────────────────

export function useProductionPlanStats(
  params?: ProductionPlanQueryParams,
  options?: ReportHookOptions,
) {
  const wsId = options?.workspaceId;
  const query = useQuery({
    queryKey: farmReportKeys.planStats(params, wsId),
    queryFn: () => farmReportApi.getProductionPlanStats(params, wsId),
    staleTime: STALE_TIME,
    enabled: options?.enabled !== false,
  });

  return {
    ...query,
    totalCount: query.data?.totalCount ?? 0,
    items: query.data?.items ?? [],
    dataThrough: query.data?.dataThrough ?? null,
  };
}

// ─── Mục 5.3 — Task Ranking ───────────────────────────────────────────────────

export function useTaskNameRanking(
  params?: TaskNameRankingQueryParams,
  options?: ReportHookOptions,
) {
  const wsId = options?.workspaceId;
  const query = useQuery({
    queryKey: farmReportKeys.taskRanking(params, wsId),
    queryFn: () => farmReportApi.getTaskNameRanking(params, wsId),
    staleTime: STALE_TIME,
    enabled: options?.enabled !== false,
  });

  return {
    ...query,
    items: query.data?.items ?? [],
    dataThrough: query.data?.dataThrough ?? null,
  };
}

// ─── Mục 5.2 — Task Stats (1 tab) ────────────────────────────────────────────

export function useTaskNameStats(
  params?: TaskNameStatsQueryParams,
  options?: ReportHookOptions,
) {
  const wsId = options?.workspaceId;
  const query = useQuery({
    queryKey: farmReportKeys.taskStats(params, wsId),
    queryFn: () => farmReportApi.getTaskNameStats(params, wsId),
    staleTime: STALE_TIME,
    enabled: options?.enabled !== false,
  });

  return {
    ...query,
    totalCount: query.data?.totalCount ?? 0,
    pendingCount: query.data?.pendingCount ?? 0,
    inProgressCount: query.data?.inProgressCount ?? 0,
  };
}
