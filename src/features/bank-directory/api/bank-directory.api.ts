import axios from "axios";
import { authApi } from "../../auth/api/auth.api";
import { apiEnv } from "../../../shared/config/api.env";
import { API_REQUEST_TIMEOUT } from "../../../shared/config/api.config";
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

const getAuthHeaders = () => {
  const token = authApi.getToken();

  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

export const bankDirectoryApi = {
  async getBanks(
    params: BankDirectoryQueryParams = {},
  ): Promise<BankDirectoryResponse<BankDirectoryItem>> {
    const response = await axios.get<BankDirectoryResponse<BankDirectoryItem>>(
      BANK_DIRECTORY_PATH,
      {
        baseURL: apiEnv.apiBaseUrl,
        timeout: API_REQUEST_TIMEOUT,
        params,
        headers: getAuthHeaders(),
      },
    );

    return response.data;
  },
  async getBankById(id: number | string): Promise<BankDirectoryItem> {
    const response = await axios.get<BankDirectoryItem>(
      `${BANK_DIRECTORY_PATH}/${id}`,
      {
        baseURL: apiEnv.apiBaseUrl,
        timeout: API_REQUEST_TIMEOUT,
        headers: getAuthHeaders(),
      },
    );

    return response.data;
  },
  async createBank(
    payload: BankDirectoryCreateRequest,
  ): Promise<BankDirectoryCreateResponse> {
    const response = await axios.post<BankDirectoryCreateResponse>(
      BANK_DIRECTORY_PATH,
      payload,
      {
        baseURL: apiEnv.apiBaseUrl,
        timeout: API_REQUEST_TIMEOUT,
        headers: getAuthHeaders(),
      },
    );

    return response.data;
  },
  async updateBank(
    id: number | string,
    payload: BankDirectoryUpdateRequest,
  ): Promise<BankDirectoryUpdateResponse> {
    const response = await axios.put<BankDirectoryUpdateResponse>(
      `${BANK_DIRECTORY_PATH}/${id}`,
      payload,
      {
        baseURL: apiEnv.apiBaseUrl,
        timeout: API_REQUEST_TIMEOUT,
        headers: getAuthHeaders(),
      },
    );

    return response.data;
  },
  async deleteBank(id: number | string): Promise<BankDirectoryDeleteResponse> {
    await axios.delete(`${BANK_DIRECTORY_PATH}/${id}`, {
      baseURL: apiEnv.apiBaseUrl,
      timeout: API_REQUEST_TIMEOUT,
      headers: getAuthHeaders(),
    });
  },
};
