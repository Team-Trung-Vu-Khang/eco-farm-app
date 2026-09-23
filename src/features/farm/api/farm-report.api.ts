import { apiClient } from "@/shared/lib/axios";
import type { PageResponse } from "../../foundation/types/foundation.type";
import type {
  GeoSummaryResponse,
  ProductionVariantItem,
  ProductionVariantsQueryParams,
  VariantCardQueryParams,
  VariantCardResponse,
  SupplyConsumptionQueryParams,
  SupplyConsumptionResponse,
  ProductionPlanQueryParams,
  ProductionPlanStatsResponse,
  TaskNameStatsQueryParams,
  TaskNameStatsResponse,
  TaskNameRankingQueryParams,
  TaskNameRankingResponse,
} from "../types/farm-report.type";

const buildHeaders = (workspaceId?: number | string | null) => {
  if (
    workspaceId === null ||
    workspaceId === undefined ||
    workspaceId === "all" ||
    workspaceId === ""
  ) {
    return { skipWorkspaceHeader: "true" };
  }
  return { "X-Workspace-Id": String(workspaceId) };
};

export const farmReportApi = {
  // ─── Mục 2 — Geo Summary ───────────────────────────────────────────────────
  getGeoSummary: (
    workspaceId?: number | string | null,
  ): Promise<GeoSummaryResponse> =>
    apiClient
      .get<GeoSummaryResponse>("/api/farm/dashboard/geo-summary", {
        headers: buildHeaders(workspaceId),
      })
      .then((r) => r.data),

  // ─── Mục 3.1 — Danh sách giống ────────────────────────────────────────────
  getProductionVariants: (
    params: ProductionVariantsQueryParams,
    workspaceId?: number | string | null,
  ): Promise<PageResponse<ProductionVariantItem>> =>
    apiClient
      .get<PageResponse<ProductionVariantItem>>(
        "/api/farm/report/production-subject-variants",
        {
          params,
          headers: buildHeaders(workspaceId),
        },
      )
      .then((r) => r.data),

  // ─── Mục 3.2 — Card báo cáo 1 giống ──────────────────────────────────────
  getVariantCard: (
    params: VariantCardQueryParams,
    workspaceId?: number | string | null,
  ): Promise<VariantCardResponse> =>
    apiClient
      .get<VariantCardResponse>(
        "/api/farm/report/production-subject-variant-cards",
        {
          params,
          headers: buildHeaders(workspaceId),
        },
      )
      .then((r) => r.data),

  // ─── Mục 4 — Tiêu thụ vật tư ─────────────────────────────────────────────
  getSupplyConsumption: (
    params: SupplyConsumptionQueryParams,
    workspaceId?: number | string | null,
  ): Promise<SupplyConsumptionResponse> =>
    apiClient
      .get<SupplyConsumptionResponse>(
        "/api/farm/report/supply-consumption-stats",
        {
          params,
          headers: buildHeaders(workspaceId),
        },
      )
      .then((r) => r.data),

  // ─── Mục 5.1 — Kế hoạch sản xuất ─────────────────────────────────────────
  getProductionPlanStats: (
    params?: ProductionPlanQueryParams,
    workspaceId?: number | string | null,
  ): Promise<ProductionPlanStatsResponse> =>
    apiClient
      .get<ProductionPlanStatsResponse>(
        "/api/farm/report/production-plan-stats",
        {
          params,
          headers: buildHeaders(workspaceId),
        },
      )
      .then((r) => r.data),

  // ─── Mục 5.2 — Công việc canh tác — stats 1 tab ──────────────────────────
  getTaskNameStats: (
    params?: TaskNameStatsQueryParams,
    workspaceId?: number | string | null,
  ): Promise<TaskNameStatsResponse> =>
    apiClient
      .get<TaskNameStatsResponse>("/api/farm/report/task-name-stats", {
        params,
        headers: buildHeaders(workspaceId),
      })
      .then((r) => r.data),

  // ─── Mục 5.3 — Công việc canh tác — ranking ──────────────────────────────
  getTaskNameRanking: (
    params?: TaskNameRankingQueryParams,
    workspaceId?: number | string | null,
  ): Promise<TaskNameRankingResponse> =>
    apiClient
      .get<TaskNameRankingResponse>("/api/farm/report/task-name-ranking", {
        params,
        headers: buildHeaders(workspaceId),
      })
      .then((r) => r.data),
};
