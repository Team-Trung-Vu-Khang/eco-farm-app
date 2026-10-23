import { apiClient } from "@/shared/lib/axios";
import type {
  OrganizationCreateRequest,
  OrganizationPageResponse,
  OrganizationQueryParams,
  OrganizationRecord,
  OrganizationUpdateRequest,
} from "../types/organization.type";

import { ADMIN_MASTER_DATA_PATHS, FARM_ENDPOINTS } from "@/shared/constants";

const withWorkspaceHeader = (workspaceId: number | string) => ({
  headers: {
    "X-Workspace-Id": String(workspaceId),
  },
});

const assertWorkspaceId = (workspaceId: number | string | undefined) => {
  if (workspaceId === undefined || workspaceId === null || workspaceId === "") {
    throw new Error("workspaceId is required for /api/farm/organizations");
  }
};

export const organizationApi = {
  async listSystem(
    params: OrganizationQueryParams = {},
  ): Promise<OrganizationPageResponse<OrganizationRecord>> {
    const response = await apiClient.get<
      OrganizationPageResponse<OrganizationRecord>
    >(ADMIN_MASTER_DATA_PATHS.organizations, { params });
    return response.data;
  },
  async list(
    params: OrganizationQueryParams = {},
    workspaceId: number | string,
  ): Promise<OrganizationPageResponse<OrganizationRecord>> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.get<
      OrganizationPageResponse<OrganizationRecord>
    >(FARM_ENDPOINTS.organizations, {
      params,
      ...withWorkspaceHeader(workspaceId),
    });

    return response.data;
  },

  async search(
    params: OrganizationQueryParams = {},
    workspaceId: number | string,
    signal?: AbortSignal,
  ): Promise<OrganizationPageResponse<OrganizationRecord>> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.get<
      OrganizationPageResponse<OrganizationRecord>
    >(FARM_ENDPOINTS.organizationSearch, {
      params,
      signal,
      ...withWorkspaceHeader(workspaceId),
    });

    return response.data;
  },

  async getById(
    id: number | string,
    workspaceId: number | string,
  ): Promise<OrganizationRecord> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.get<OrganizationRecord>(
      `${FARM_ENDPOINTS.organizations}/${id}`,
      withWorkspaceHeader(workspaceId),
    );

    return response.data;
  },

  async create(
    payload: OrganizationCreateRequest,
    workspaceId: number | string,
  ): Promise<OrganizationRecord> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.post<OrganizationRecord>(
      FARM_ENDPOINTS.organizations,
      payload,
      withWorkspaceHeader(workspaceId),
    );

    return response.data;
  },

  async update(
    id: number | string,
    payload: OrganizationUpdateRequest,
    workspaceId: number | string,
  ): Promise<OrganizationRecord> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.put<OrganizationRecord>(
      `${FARM_ENDPOINTS.organizations}/${id}`,
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
      `${FARM_ENDPOINTS.organizations}/${id}`,
      withWorkspaceHeader(workspaceId),
    );
  },
};
