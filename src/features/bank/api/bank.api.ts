import axios from "axios";
import { authEnv } from "../../../shared/config/auth.env";
import type {
  BankDirectoryItem,
  BankDirectoryQueryParams,
  BankDirectoryResponse,
} from "../types/bank.type";

const BANK_DIRECTORY_PATH = "/api/master-data/banks";

const buildApiUrl = (path: string) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = authEnv.apiBaseUrl;

  return baseUrl ? `${baseUrl}${cleanPath}` : cleanPath;
};

export const bankApi = {
  path: BANK_DIRECTORY_PATH,
  buildListUrl() {
    return buildApiUrl(BANK_DIRECTORY_PATH);
  },
  async getBanks(
    params: BankDirectoryQueryParams = {},
  ): Promise<BankDirectoryResponse<BankDirectoryItem>> {
    const response = await axios.get<BankDirectoryResponse<BankDirectoryItem>>(
      BANK_DIRECTORY_PATH,
      {
        baseURL: authEnv.apiBaseUrl,
        timeout: 30000,
        params,
      },
    );

    return response.data;
  },
};
