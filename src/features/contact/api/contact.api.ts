import { apiClient } from "@/shared/lib/axios";
import type {
  ContactCreateRequest,
  ContactCreateResponse,
  ContactPageResponse,
  ContactQueryParams,
  ContactRecord,
  ContactUpdateRequest,
  ContactUpdateResponse,
  ContactLinkRequest,
} from "../types/contact.type";

const CONTACT_PATH = "/api/farm/contacts" as const;
const CONTACT_LINK_PATH = "/api/farm/contact-links" as const;

const withWorkspaceHeader = (workspaceId: number | string) => ({
  headers: {
    "X-Workspace-Id": String(workspaceId),
  },
});

const assertWorkspaceId = (workspaceId: number | string | null | undefined) => {
  if (workspaceId === null || workspaceId === undefined || workspaceId === "") {
    throw new Error("workspaceId is required for /api/farm/contacts");
  }
};

export const contactApi = {
  async list(
    params: ContactQueryParams = {},
    workspaceId: number | string,
  ): Promise<ContactPageResponse<ContactRecord>> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.get<ContactPageResponse<ContactRecord>>(
      CONTACT_PATH,
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
  ): Promise<ContactRecord> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.get<ContactRecord>(
      `${CONTACT_PATH}/${id}`,
      withWorkspaceHeader(workspaceId),
    );

    return response.data;
  },

  async create(
    payload: ContactCreateRequest,
    workspaceId: number | string,
  ): Promise<ContactCreateResponse> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.post<ContactCreateResponse>(
      CONTACT_PATH,
      payload,
      withWorkspaceHeader(workspaceId),
    );

    return response.data;
  },

  async update(
    id: number | string,
    payload: ContactUpdateRequest,
    workspaceId: number | string,
  ): Promise<ContactUpdateResponse> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.put<ContactUpdateResponse>(
      `${CONTACT_PATH}/${id}`,
      payload,
      withWorkspaceHeader(workspaceId),
    );

    return response.data;
  },

  async delete(id: number | string, workspaceId: number | string): Promise<void> {
    assertWorkspaceId(workspaceId);

    await apiClient.delete(`${CONTACT_PATH}/${id}`, withWorkspaceHeader(workspaceId));
  },

  async attachOwner(
    ownerType: string,
    ownerId: number | string,
    payload: ContactLinkRequest,
    workspaceId: number | string,
  ): Promise<ContactRecord> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.post<ContactRecord>(
      `${CONTACT_LINK_PATH}/${ownerType}/${ownerId}`,
      payload,
      withWorkspaceHeader(workspaceId),
    );

    return response.data;
  },

  async replaceOwner(
    ownerType: string,
    ownerId: number | string,
    payload: ContactLinkRequest[],
    workspaceId: number | string,
  ): Promise<ContactRecord[]> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.put<ContactRecord[]>(
      `${CONTACT_LINK_PATH}/${ownerType}/${ownerId}`,
      payload,
      withWorkspaceHeader(workspaceId),
    );

    return response.data;
  },

  async detachOwner(
    ownerType: string,
    ownerId: number | string,
    contactId: number | string,
    workspaceId: number | string,
  ): Promise<void> {
    assertWorkspaceId(workspaceId);

    await apiClient.delete(
      `${CONTACT_LINK_PATH}/${ownerType}/${ownerId}/${contactId}`,
      withWorkspaceHeader(workspaceId),
    );
  },
};
