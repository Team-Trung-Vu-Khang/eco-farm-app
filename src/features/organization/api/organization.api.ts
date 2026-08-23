import { apiClient } from "@/shared/lib/axios";
import type {
  OrganizationCreateRequest,
  OrganizationPageResponse,
  OrganizationQueryParams,
  OrganizationRecord,
  OrganizationUpdateRequest,
} from "../types/organization.type";

const ORGANIZATION_PATH = "/api/farm/organizations" as const;
const ORGANIZATION_SEARCH_PATH = `${ORGANIZATION_PATH}/search` as const;

const withWorkspaceHeader = (workspaceId: number | string) => ({
  headers: {
    "X-Workspace-Id": String(workspaceId),
  },
});

const assertWorkspaceId = (workspaceId: number | string | undefined) => {
  if (workspaceId === undefined || workspaceId === null || workspaceId === "") {
    throw new Error(
      "workspaceId is required for /api/farm/organizations",
    );
  }
};

export const organizationApi = {
  async list(
    params: OrganizationQueryParams = {},
    workspaceId: number | string,
  ): Promise<OrganizationPageResponse<OrganizationRecord>> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.get<
      OrganizationPageResponse<OrganizationRecord>
    >(ORGANIZATION_PATH, {
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
    >(ORGANIZATION_SEARCH_PATH, {
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
      `${ORGANIZATION_PATH}/${id}`,
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
      ORGANIZATION_PATH,
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
      `${ORGANIZATION_PATH}/${id}`,
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
      `${ORGANIZATION_PATH}/${id}`,
      withWorkspaceHeader(workspaceId),
    );
  },
};
