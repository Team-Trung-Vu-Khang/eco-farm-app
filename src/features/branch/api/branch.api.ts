import { apiClient } from "@/shared/lib/axios";
import type {
  BranchPageResponse,
  BranchQueryParams,
  BranchCreateRequest,
  BranchRecord,
  BranchUpdateRequest,
} from "../types/branch.type";

import { FARM_ENDPOINTS } from "@/shared/constants";

const withWorkspaceHeader = (workspaceId: number | string) => ({
  headers: {
    "X-Workspace-Id": String(workspaceId),
  },
});

const assertWorkspaceId = (workspaceId: number | string | null | undefined) => {
  if (workspaceId === null || workspaceId === undefined || workspaceId === "") {
    throw new Error("workspaceId is required for /api/farm/branches");
  }
};

export const branchApi = {
  async list(
    params: BranchQueryParams = {},
    workspaceId: number | string,
  ): Promise<BranchPageResponse<BranchRecord>> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.get<BranchPageResponse<BranchRecord>>(
      FARM_ENDPOINTS.branches,
      {
        params,
        ...withWorkspaceHeader(workspaceId),
      },
    );

    return response.data;
  },

  async getById(
    id: number | string,
    workspaceId: number | string,
  ): Promise<BranchRecord> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.get<BranchRecord>(
      `${FARM_ENDPOINTS.branches}/${id}`,
      withWorkspaceHeader(workspaceId),
    );

    return response.data;
  },

  async create(
    payload: BranchCreateRequest,
    workspaceId: number | string,
  ): Promise<BranchRecord> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.post<BranchRecord>(
      FARM_ENDPOINTS.branches,
      payload,
      withWorkspaceHeader(workspaceId),
    );

    return response.data;
  },

  async update(
    id: number | string,
    payload: BranchUpdateRequest,
    workspaceId: number | string,
  ): Promise<BranchRecord> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.put<BranchRecord>(
      `${FARM_ENDPOINTS.branches}/${id}`,
      payload,
      withWorkspaceHeader(workspaceId),
    );

    return response.data;
  },

  async delete(
    id: number | string,
    workspaceId: number | string,
  ): Promise<void> {
    assertWorkspaceId(workspaceId);

    await apiClient.delete(
      `${FARM_ENDPOINTS.branches}/${id}`,
      withWorkspaceHeader(workspaceId),
    );
  },
};
