import { apiClient } from "@/shared/lib/axios";
import { FARM_ENDPOINTS } from "@/shared/constants";
import type {
  AdminDiaryActivitySummaryResponse,
  AdminDiaryWorkspacesPageResponse,
  AdminDiaryWorkspacesQueryParams,
} from "../types/admin-diary-activity.type";

const SKIP_WORKSPACE_CONFIG = {
  headers: {
    skipWorkspaceHeader: "true",
  },
};

export const adminDiaryActivityApi = {
  // GET /api/admin/farm/report/diary-activity/summary
  getDiaryActivitySummary: (month?: string): Promise<AdminDiaryActivitySummaryResponse> =>
    apiClient
      .get<AdminDiaryActivitySummaryResponse>(
        FARM_ENDPOINTS.adminReportDiaryActivitySummary,
        {
          ...SKIP_WORKSPACE_CONFIG,
          params: month ? { month } : undefined,
        },
      )
      .then((r) => r.data),

  // GET /api/admin/farm/report/diary-activity/workspaces
  getDiaryActivityWorkspaces: (
    params?: AdminDiaryWorkspacesQueryParams,
  ): Promise<AdminDiaryWorkspacesPageResponse> =>
    apiClient
      .get<AdminDiaryWorkspacesPageResponse>(
        FARM_ENDPOINTS.adminReportDiaryActivityWorkspaces,
        {
          ...SKIP_WORKSPACE_CONFIG,
          params,
        },
      )
      .then((r) => r.data),
};
