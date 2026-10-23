import { apiClient } from "@/shared/lib/axios";
import {
  ADMIN_MASTER_DATA_PATHS,
  MASTER_DATA_PATHS,
} from "@/shared/constants";
import type {
  BankDirectoryCreateRequest,
  BankDirectoryCreateResponse,
  BankDirectoryDeleteResponse,
  BankDirectoryItem,
  BankDirectoryQueryParams,
  BankDirectoryResponse,
  BankDirectoryUpdateRequest,
  BankDirectoryUpdateResponse,
} from "../types/bank-directory.type";


export const bankDirectoryApi = {
  async getBanks(
    params: BankDirectoryQueryParams = {},
  ): Promise<BankDirectoryResponse<BankDirectoryItem>> {
    const response = await apiClient.get<BankDirectoryResponse<BankDirectoryItem>>(
      MASTER_DATA_PATHS.banks,
      { params },
    );

    return response.data;
  },
  async getBankById(id: number | string): Promise<BankDirectoryItem> {
    const response = await apiClient.get<BankDirectoryItem>(
      `${MASTER_DATA_PATHS.banks}/${id}`,
    );

    return response.data;
  },
  async createBank(
    payload: BankDirectoryCreateRequest,
  ): Promise<BankDirectoryCreateResponse> {
    const response = await apiClient.post<BankDirectoryCreateResponse>(
      ADMIN_MASTER_DATA_PATHS.banks,
      payload,
    );

    return response.data;
  },
  async updateBank(
    id: number | string,
    payload: BankDirectoryUpdateRequest,
  ): Promise<BankDirectoryUpdateResponse> {
    const response = await apiClient.put<BankDirectoryUpdateResponse>(
      `${ADMIN_MASTER_DATA_PATHS.banks}/${id}`,
      payload,
    );

    return response.data;
  },
  async deleteBank(id: number | string): Promise<BankDirectoryDeleteResponse> {
    await apiClient.delete(`${ADMIN_MASTER_DATA_PATHS.banks}/${id}`);
  },
};
