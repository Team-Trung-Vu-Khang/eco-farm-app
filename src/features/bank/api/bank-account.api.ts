import { apiClient } from "@/shared/lib/axios";

import type {
  BankAccountCreateRequest,
  BankAccountCreateResponse,
  BankAccountPageResponse,
  BankAccountQueryParams,
  BankAccountRecord,
  BankAccountDeleteRequest,
  BankAccountUpdateRequest,
  BankAccountUpdateResponse,
} from "../types/bank-account.type";

const BANK_ACCOUNT_PATH = "/api/farm/bank-accounts" as const;

const withWorkspaceHeader = (workspaceId: number | string) => ({
  headers: {
    "X-Workspace-Id": String(workspaceId),
  },
});

const assertWorkspaceId = (workspaceId: number | string | null | undefined) => {
  if (workspaceId === null || workspaceId === undefined || workspaceId === "") {
    throw new Error("workspaceId is required for /api/farm/bank-accounts");
  }
};

export const bankAccountApi = {
  async list(
    params: BankAccountQueryParams = {},
    workspaceId: number | string,
  ): Promise<BankAccountPageResponse<BankAccountRecord>> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.get<BankAccountPageResponse<BankAccountRecord>>(
      BANK_ACCOUNT_PATH,
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
  ): Promise<BankAccountRecord> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.get<BankAccountRecord>(
      `${BANK_ACCOUNT_PATH}/${id}`,
      withWorkspaceHeader(workspaceId),
    );

    return response.data;
  },

  async create(
    payload: BankAccountCreateRequest,
    workspaceId: number | string,
  ): Promise<BankAccountCreateResponse> {
    assertWorkspaceId(workspaceId);

    const response = await apiClient.post<BankAccountCreateResponse>(
      BANK_ACCOUNT_PATH,
      payload,
      withWorkspaceHeader(workspaceId),
    );

    return response.data;
  },

  async update(
    id: number | string,
    payload: BankAccountUpdateRequest,
    workspaceId: number | string,
  ): Promise<BankAccountUpdateResponse> {
    assertWorkspaceId(workspaceId);

    const requestPayload: BankAccountUpdateRequest = {
      ...payload,
      // The API requires the identifier in both the route and request body.
      id: payload.id ?? id,
      // Swagger defines this field as an object rather than nullable.
      metadataJson: payload.metadataJson ?? {},
    };

    const response = await apiClient.put<BankAccountUpdateResponse>(
      `${BANK_ACCOUNT_PATH}/${id}`,
      requestPayload,
      withWorkspaceHeader(workspaceId),
    );

    return response.data;
  },

  async delete(
    { id, workspaceId }: BankAccountDeleteRequest,
  ): Promise<void> {
    assertWorkspaceId(workspaceId);

    await apiClient.delete(
      `${BANK_ACCOUNT_PATH}/${id}`,
      withWorkspaceHeader(workspaceId),
    );
  },
};
