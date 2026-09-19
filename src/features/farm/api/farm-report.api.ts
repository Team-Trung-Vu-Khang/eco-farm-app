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

export const farmReportApi = {
  // ─── Mục 2 — Geo Summary ───────────────────────────────────────────────────
  getGeoSummary: (): Promise<GeoSummaryResponse> =>
    apiClient
      .get<GeoSummaryResponse>("/api/farm/dashboard/geo-summary")
      .then((r) => r.data),

  // ─── Mục 3.1 — Danh sách giống ────────────────────────────────────────────
  getProductionVariants: (
    params: ProductionVariantsQueryParams,
  ): Promise<PageResponse<ProductionVariantItem>> =>
    apiClient
      .get<PageResponse<ProductionVariantItem>>(
        "/api/farm/report/production-subject-variants",
        { params },
      )
      .then((r) => r.data),

  // ─── Mục 3.2 — Card báo cáo 1 giống ──────────────────────────────────────
  getVariantCard: (params: VariantCardQueryParams): Promise<VariantCardResponse> =>
    apiClient
      .get<VariantCardResponse>(
        "/api/farm/report/production-subject-variant-cards",
        { params },
      )
      .then((r) => r.data),

  // ─── Mục 4 — Tiêu thụ vật tư ─────────────────────────────────────────────
  getSupplyConsumption: (
    params: SupplyConsumptionQueryParams,
  ): Promise<SupplyConsumptionResponse> =>
    apiClient
      .get<SupplyConsumptionResponse>(
        "/api/farm/report/supply-consumption-stats",
        { params },
      )
      .then((r) => r.data),

  // ─── Mục 5.1 — Kế hoạch sản xuất ─────────────────────────────────────────
  getProductionPlanStats: (
    params?: ProductionPlanQueryParams,
  ): Promise<ProductionPlanStatsResponse> =>
    apiClient
      .get<ProductionPlanStatsResponse>(
        "/api/farm/report/production-plan-stats",
        { params },
      )
      .then((r) => r.data),

  // ─── Mục 5.2 — Công việc canh tác — stats 1 tab ──────────────────────────
  getTaskNameStats: (
    params?: TaskNameStatsQueryParams,
  ): Promise<TaskNameStatsResponse> =>
    apiClient
      .get<TaskNameStatsResponse>("/api/farm/report/task-name-stats", {
        params,
      })
      .then((r) => r.data),

  // ─── Mục 5.3 — Công việc canh tác — ranking ──────────────────────────────
  getTaskNameRanking: (
    params?: TaskNameRankingQueryParams,
  ): Promise<TaskNameRankingResponse> =>
    apiClient
      .get<TaskNameRankingResponse>("/api/farm/report/task-name-ranking", {
        params,
      })
      .then((r) => r.data),
};
