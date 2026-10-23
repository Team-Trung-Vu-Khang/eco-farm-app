import { apiClient } from "@/shared/lib/axios";
import { FARM_ENDPOINTS } from "@/shared/constants";
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

const isAllWorkspaces = (workspaceId?: number | string | null) =>
  workspaceId === null ||
  workspaceId === undefined ||
  workspaceId === "all" ||
  workspaceId === "";

const buildHeaders = (workspaceId?: number | string | null) => {
  if (isAllWorkspaces(workspaceId)) {
    return { skipWorkspaceHeader: "true" };
  }
  return { "X-Workspace-Id": String(workspaceId) };
};

export const farmReportApi = {
  // ─── Geo Summary ───────────────────────────────────────────────────────────
  getGeoSummary: (
    workspaceId?: number | string | null,
  ): Promise<GeoSummaryResponse> =>
    apiClient
      .get<GeoSummaryResponse>(FARM_ENDPOINTS.dashboardGeoSummary, {
        headers: buildHeaders(workspaceId),
      })
      .then((r) => r.data),

  // ─── Danh sách giống ───────────────────────────────────────────────────────
  getProductionVariants: (
    params: ProductionVariantsQueryParams,
    workspaceId?: number | string | null,
  ): Promise<PageResponse<ProductionVariantItem>> =>
    apiClient
      .get<PageResponse<ProductionVariantItem>>(
        FARM_ENDPOINTS.reportEndpoint(
          FARM_ENDPOINTS.adminReportProductionVariants,
          isAllWorkspaces(workspaceId),
        ),
        {
          params,
          headers: buildHeaders(workspaceId),
        },
      )
      .then((r) => r.data),

  // ─── Card báo cáo 1 giống ──────────────────────────────────────────────────
  getVariantCard: (
    params: VariantCardQueryParams,
    workspaceId?: number | string | null,
  ): Promise<VariantCardResponse> =>
    apiClient
      .get<VariantCardResponse>(
        FARM_ENDPOINTS.reportEndpoint(
          FARM_ENDPOINTS.reportVariantCards,
          isAllWorkspaces(workspaceId),
        ),
        {
          params,
          headers: buildHeaders(workspaceId),
        },
      )
      .then((r) => r.data),

  // ─── Tiêu thụ vật tư ───────────────────────────────────────────────────────
  getSupplyConsumption: (
    params: SupplyConsumptionQueryParams,
    workspaceId?: number | string | null,
  ): Promise<SupplyConsumptionResponse> =>
    apiClient
      .get<SupplyConsumptionResponse>(
        FARM_ENDPOINTS.reportEndpoint(
          FARM_ENDPOINTS.reportSupplyConsumptionStats,
          isAllWorkspaces(workspaceId),
        ),
        {
          params,
          headers: buildHeaders(workspaceId),
        },
      )
      .then((r) => r.data),

  // ─── Kế hoạch sản xuất ─────────────────────────────────────────────────────
  getProductionPlanStats: (
    params?: ProductionPlanQueryParams,
    workspaceId?: number | string | null,
  ): Promise<ProductionPlanStatsResponse> =>
    apiClient
      .get<ProductionPlanStatsResponse>(
        FARM_ENDPOINTS.reportEndpoint(
          FARM_ENDPOINTS.reportProductionPlanStats,
          isAllWorkspaces(workspaceId),
        ),
        {
          params,
          headers: buildHeaders(workspaceId),
        },
      )
      .then((r) => r.data),

  // ─── Công việc canh tác — stats 1 tab ──────────────────────────────────────
  getTaskNameStats: (
    params?: TaskNameStatsQueryParams,
    workspaceId?: number | string | null,
  ): Promise<TaskNameStatsResponse> =>
    apiClient
      .get<TaskNameStatsResponse>(
        FARM_ENDPOINTS.reportEndpoint(
          FARM_ENDPOINTS.reportTaskNameStats,
          isAllWorkspaces(workspaceId),
        ),
        {
          params,
          headers: buildHeaders(workspaceId),
        },
      )
      .then((r) => r.data),

  // ─── Công việc canh tác — ranking ──────────────────────────────────────────
  getTaskNameRanking: (
    params?: TaskNameRankingQueryParams,
    workspaceId?: number | string | null,
  ): Promise<TaskNameRankingResponse> =>
    apiClient
      .get<TaskNameRankingResponse>(
        FARM_ENDPOINTS.reportEndpoint(
          FARM_ENDPOINTS.reportTaskNameRanking,
          isAllWorkspaces(workspaceId),
        ),
        {
          params,
          headers: buildHeaders(workspaceId),
        },
      )
      .then((r) => r.data),
};
