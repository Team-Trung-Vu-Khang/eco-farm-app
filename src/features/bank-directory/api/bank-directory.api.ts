import { apiClient } from "../../../shared/lib/axios";
import { MASTER_DATA_PATHS } from "../../../shared/constants/master-data.constants";
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

const BANK_DIRECTORY_PATH = MASTER_DATA_PATHS.banks;

export const bankDirectoryApi = {
  async getBanks(
    params: BankDirectoryQueryParams = {},
  ): Promise<BankDirectoryResponse<BankDirectoryItem>> {
    const response = await apiClient.get<BankDirectoryResponse<BankDirectoryItem>>(
      BANK_DIRECTORY_PATH,
      { params },
    );

    return response.data;
  },
  async getBankById(id: number | string): Promise<BankDirectoryItem> {
    const response = await apiClient.get<BankDirectoryItem>(
      `${BANK_DIRECTORY_PATH}/${id}`,
    );

    return response.data;
  },
  async createBank(
    payload: BankDirectoryCreateRequest,
  ): Promise<BankDirectoryCreateResponse> {
    const response = await apiClient.post<BankDirectoryCreateResponse>(
      BANK_DIRECTORY_PATH,
      payload,
    );

    return response.data;
  },
  async updateBank(
    id: number | string,
    payload: BankDirectoryUpdateRequest,
  ): Promise<BankDirectoryUpdateResponse> {
    const response = await apiClient.put<BankDirectoryUpdateResponse>(
      `${BANK_DIRECTORY_PATH}/${id}`,
      payload,
    );

    return response.data;
  },
  async deleteBank(id: number | string): Promise<BankDirectoryDeleteResponse> {
    await apiClient.delete(`${BANK_DIRECTORY_PATH}/${id}`);
  },
};
