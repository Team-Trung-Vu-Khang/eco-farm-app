import { apiClient } from "@/shared/lib/axios";
import { FARM_ENDPOINTS } from "@/shared/constants";
import type {
  AdminWorkspaceStatsResponse,
  ActiveFarmersReportResponse,
  ActiveFarmersWorkspacesResponse,
  CreateExportJobPayload,
  ExportJobResponse,
  HarvestByVariantResponse,
  HarvestByVariantDetailResponse,
} from "../types/admin-dashboard.type";

const SKIP_WORKSPACE_CONFIG = {
  headers: {
    skipWorkspaceHeader: "true",
  },
};

export const adminDashboardApi = {
  // 1. Workspace Stats (be-mevi-center)
  getWorkspaceStats: (): Promise<AdminWorkspaceStatsResponse> =>
    apiClient
      .get<AdminWorkspaceStatsResponse>(
        FARM_ENDPOINTS.adminDashboardWorkspaces,
        SKIP_WORKSPACE_CONFIG,
      )
      .then((r) => r.data),

  // 2. Active Farmers Report — Summary + Top N (be-mevi-farm)
  getActiveFarmersReport: (params?: {
    month?: string;
    size?: number;
  }): Promise<ActiveFarmersReportResponse> =>
    apiClient
      .get<ActiveFarmersReportResponse>(
        FARM_ENDPOINTS.adminReportActiveFarmers,
        {
          ...SKIP_WORKSPACE_CONFIG,
          params,
        },
      )
      .then((r) => r.data),

  // 3. Active Farmers Workspaces — List Active/Inactive with pagination (be-mevi-farm)
  getActiveFarmersWorkspaces: (params?: {
    month?: string;
    status?: "ACTIVE" | "INACTIVE";
    page?: number;
    size?: number;
  }): Promise<ActiveFarmersWorkspacesResponse> =>
    apiClient
      .get<ActiveFarmersWorkspacesResponse>(
        FARM_ENDPOINTS.adminReportActiveFarmersWorkspaces,
        {
          ...SKIP_WORKSPACE_CONFIG,
          params,
        },
      )
      .then((r) => r.data),

  // 4. Create Active Farmers Export Job (be-mevi-farm)
  createActiveFarmersExportJob: (
    payload: CreateExportJobPayload,
  ): Promise<ExportJobResponse> =>
    apiClient
      .post<ExportJobResponse>(
        FARM_ENDPOINTS.adminReportActiveFarmersExportJobs,
        payload,
        SKIP_WORKSPACE_CONFIG,
      )
      .then((r) => r.data),

  // 5. Poll Export Job Status (be-mevi-farm)
  getExportJobStatus: (id: string): Promise<ExportJobResponse> =>
    apiClient
      .get<ExportJobResponse>(FARM_ENDPOINTS.adminExports(id), SKIP_WORKSPACE_CONFIG)
      .then((r) => r.data),

  // 6. Harvest by Variant — Donut chart + dropdown (be-mevi-farm)
  getHarvestByVariant: (params?: {
    domainCode?: string;
    fromMonth?: string;
    toMonth?: string;
    top?: number;
  }): Promise<HarvestByVariantResponse> =>
    apiClient
      .get<HarvestByVariantResponse>(
        FARM_ENDPOINTS.adminReportHarvestByVariant,
        {
          ...SKIP_WORKSPACE_CONFIG,
          params,
        },
      )
      .then((r) => r.data),

  // 7. Harvest by Variant Detail — Single variant detail + top farmers & monthly chart (be-mevi-farm)
  getHarvestByVariantDetail: (params: {
    variantCode: string;
    domainCode?: string;
    fromMonth?: string;
    toMonth?: string;
    limit?: number;
  }): Promise<HarvestByVariantDetailResponse> =>
    apiClient
      .get<HarvestByVariantDetailResponse>(
        FARM_ENDPOINTS.adminReportHarvestByVariantDetail,
        {
          ...SKIP_WORKSPACE_CONFIG,
          params,
        },
      )
      .then((r) => r.data),

  // 8. Harvest by Subject — Top production subjects report (be-mevi-farm)
  getHarvestBySubject: (params?: {
    domainCode?: string;
    fromMonth?: string;
    toMonth?: string;
    top?: number;
  }): Promise<HarvestByVariantResponse> =>
    apiClient
      .get<HarvestByVariantResponse>(
        FARM_ENDPOINTS.adminReportHarvestBySubject,
        {
          ...SKIP_WORKSPACE_CONFIG,
          params,
        },
      )
      .then((r) => r.data),
};
