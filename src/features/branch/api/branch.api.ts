import { apiClient } from "@/shared/lib/axios";
import type {
  BranchPageResponse,
  BranchQueryParams,
  BranchCreateRequest,
  BranchRecord,
  BranchUpdateRequest,
} from "../types/branch.type";

const BRANCH_PATH = "/api/farm/branches" as const;

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
      BRANCH_PATH,
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
      `${BRANCH_PATH}/${id}`,
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
      BRANCH_PATH,
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
      `${BRANCH_PATH}/${id}`,
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
      `${BRANCH_PATH}/${id}`,
      withWorkspaceHeader(workspaceId),
    );
  },
};
