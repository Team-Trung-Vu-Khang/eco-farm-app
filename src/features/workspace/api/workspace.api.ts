import { apiClient } from "@/shared/lib/axios";
import { WORKSPACE_API_PATHS } from "@/shared/constants/workspace.constants";
import type {
  WorkspaceCreateRequest,
  WorkspacePageResponse,
  WorkspaceQueryParams,
  WorkspaceRecord,
  WorkspaceUpdateRequest,
} from "../types/workspace.type";

export const workspaceApi = {
  async list(
    params: WorkspaceQueryParams = {},
  ): Promise<WorkspacePageResponse<WorkspaceRecord>> {
    const response = await apiClient.get<
      WorkspacePageResponse<WorkspaceRecord>
    >(WORKSPACE_API_PATHS.center, { params });

    return response.data;
  },

  async getById(id: number | string): Promise<WorkspaceRecord> {
    const response = await apiClient.get<WorkspaceRecord>(
      WORKSPACE_API_PATHS.current,
      {
        headers: {
          "X-Workspace-Id": String(id),
        },
      },
    );

    return response.data;
  },

  async create(payload: WorkspaceCreateRequest): Promise<WorkspaceRecord> {
    const response = await apiClient.post<WorkspaceRecord>(
      WORKSPACE_API_PATHS.admin,
      payload,
    );

    return response.data;
  },

  async update(
    id: number | string,
    payload: WorkspaceUpdateRequest,
  ): Promise<WorkspaceRecord> {
    const response = await apiClient.put<WorkspaceRecord>(
      WORKSPACE_API_PATHS.current,
      payload,
      {
        headers: {
          "X-Workspace-Id": String(id),
        },
      },
    );

    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await apiClient.delete(`${WORKSPACE_API_PATHS.admin}/${id}`);
  },
};
