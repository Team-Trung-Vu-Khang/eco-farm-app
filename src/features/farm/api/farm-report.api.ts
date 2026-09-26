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

const getEndpoint = (basePath: string, workspaceId?: number | string | null) => {
  if (isAllWorkspaces(workspaceId)) {
    return `/api/admin${basePath}`;
  }
  return `/api${basePath}`;
};

export const farmReportApi = {
  // ─── Geo Summary ───────────────────────────────────────────────────────────
  getGeoSummary: (
    workspaceId?: number | string | null,
  ): Promise<GeoSummaryResponse> =>
    apiClient
      .get<GeoSummaryResponse>("/api/farm/dashboard/geo-summary", {
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
        getEndpoint("/farm/report/production-subject-variants", workspaceId),
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
        getEndpoint("/farm/report/production-subject-variant-cards", workspaceId),
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
        getEndpoint("/farm/report/supply-consumption-stats", workspaceId),
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
        getEndpoint("/farm/report/production-plan-stats", workspaceId),
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
        getEndpoint("/farm/report/task-name-stats", workspaceId),
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
        getEndpoint("/farm/report/task-name-ranking", workspaceId),
        {
          params,
          headers: buildHeaders(workspaceId),
        },
      )
      .then((r) => r.data),
};
