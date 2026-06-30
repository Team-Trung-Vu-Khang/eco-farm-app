import { apiClient } from "@/shared/lib/axios";
import type {
  WorkspaceCreateRequest,
  WorkspacePageResponse,
  WorkspaceQueryParams,
  WorkspaceRecord,
  WorkspaceUpdateRequest,
} from "../types/workspace.type";

const WORKSPACE_PATH = "/api/center/workspaces";

export const workspaceApi = {
  async list(
    params: WorkspaceQueryParams = {},
  ): Promise<WorkspacePageResponse<WorkspaceRecord>> {
    const response = await apiClient.get<WorkspacePageResponse<WorkspaceRecord>>(
      WORKSPACE_PATH,
      { params },
    );

    return response.data;
  },

  async getById(id: number | string): Promise<WorkspaceRecord> {
    const response = await apiClient.get<WorkspaceRecord>(
      `${WORKSPACE_PATH}/${id}`,
    );

    return response.data;
  },

  async create(
    payload: WorkspaceCreateRequest,
  ): Promise<WorkspaceRecord> {
    const response = await apiClient.post<WorkspaceRecord>(
      WORKSPACE_PATH,
      payload,
    );

    return response.data;
  },

  async update(
    id: number | string,
    payload: WorkspaceUpdateRequest,
  ): Promise<WorkspaceRecord> {
    const response = await apiClient.put<WorkspaceRecord>(
      `${WORKSPACE_PATH}/${id}`,
      payload,
    );

    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await apiClient.delete(`${WORKSPACE_PATH}/${id}`);
  },
};
