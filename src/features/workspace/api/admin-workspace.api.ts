import { apiClient } from "@/shared/lib/axios";
import type {
  WorkspaceCreateRequest,
  WorkspacePageResponse,
  WorkspaceQueryParams,
  WorkspaceRecord,
} from "../types/workspace.type";

const ADMIN_WORKSPACE_PATH = "/api/admin/workspaces" as const;

export const adminWorkspaceApi = {
  async list(
    params: WorkspaceQueryParams = {},
  ): Promise<WorkspacePageResponse<WorkspaceRecord>> {
    const response = await apiClient.get<
      WorkspacePageResponse<WorkspaceRecord>
    >(ADMIN_WORKSPACE_PATH, {
      params,
    });

    return response.data;
  },

  async getById(id: number | string): Promise<WorkspaceRecord> {
    const response = await apiClient.get<WorkspaceRecord>(
      `${ADMIN_WORKSPACE_PATH}/${id}`,
    );

    return response.data;
  },

  async create(
    payload: WorkspaceCreateRequest,
  ): Promise<WorkspaceRecord> {
    const response = await apiClient.post<WorkspaceRecord>(
      ADMIN_WORKSPACE_PATH,
      payload,
    );

    return response.data;
  },

  async update(
    id: number | string,
    payload: WorkspaceCreateRequest,
  ): Promise<WorkspaceRecord> {
    const response = await apiClient.put<WorkspaceRecord>(
      `${ADMIN_WORKSPACE_PATH}/${id}`,
      payload,
    );

    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await apiClient.delete(`${ADMIN_WORKSPACE_PATH}/${id}`);
  },
};
