import { apiClient } from "@/shared/lib/axios";
import type {
  ContactGroupCreateResponse,
  ContactGroupCreateRequest,
  ContactGroupPageResponse,
  ContactGroupQueryParams,
  ContactGroupRecord,
  ContactGroupUpdateResponse,
  ContactGroupUpdateRequest,
} from "../types/contact-group.type";

import { FARM_ENDPOINTS } from "@/shared/constants";

const withWorkspaceHeader = (workspaceId: number | string) => ({
  headers: {
    "X-Workspace-Id": String(workspaceId),
  },
});

const assertWorkspaceId = (workspaceId: number | string | null | undefined) => {
  if (workspaceId === null || workspaceId === undefined || workspaceId === "") {
    throw new Error("workspaceId is required for /api/farm/contact-groups");
  }
};

export const contactGroupApi = {
  async list(
    params: ContactGroupQueryParams = {},
    workspaceId: number | string,
  ): Promise<ContactGroupPageResponse<ContactGroupRecord>> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.get<
      ContactGroupPageResponse<ContactGroupRecord>
    >(FARM_ENDPOINTS.contactGroups, {
      params,
      ...withWorkspaceHeader(workspaceId),
    });

    return response.data;
  },

  async getById(
    id: number | string,
    workspaceId: number | string,
  ): Promise<ContactGroupRecord> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.get<ContactGroupRecord>(
      `${FARM_ENDPOINTS.contactGroups}/${id}`,
      withWorkspaceHeader(workspaceId),
    );

    return response.data;
  },

  async create(
    payload: ContactGroupCreateRequest,
    workspaceId: number | string,
  ): Promise<ContactGroupCreateResponse> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.post<ContactGroupCreateResponse>(
      FARM_ENDPOINTS.contactGroups,
      payload,
      withWorkspaceHeader(workspaceId),
    );

    return response.data;
  },

  async update(
    id: number | string,
    payload: ContactGroupUpdateRequest,
    workspaceId: number | string,
  ): Promise<ContactGroupUpdateResponse> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.put<ContactGroupUpdateResponse>(
      `${FARM_ENDPOINTS.contactGroups}/${id}`,
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
      `${FARM_ENDPOINTS.contactGroups}/${id}`,
      withWorkspaceHeader(workspaceId),
    );
  },
};
