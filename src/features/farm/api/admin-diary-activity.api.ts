import { apiClient } from "@/shared/lib/axios";
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
        "/api/admin/farm/report/diary-activity/summary",
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
        "/api/admin/farm/report/diary-activity/workspaces",
        {
          ...SKIP_WORKSPACE_CONFIG,
          params,
        },
      )
      .then((r) => r.data),
};
