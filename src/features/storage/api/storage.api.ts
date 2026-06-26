import axios from "axios";
import { authApi } from "../../auth/api/auth.api";
import { apiEnv } from "../../../shared/config/api.env";
import { API_REQUEST_TIMEOUT } from "../../../shared/config/api.config";
import type { StorageFileUploadResponse } from "../types/storage-file.type";

const STORAGE_FILES_PATH = "/api/storage/files";

const getAuthHeaders = () => {
  const token = authApi.getToken();

  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

export interface StorageFileUploadRequest {
  file: File;
  folder?: string;
}

export const storageApi = {
  async uploadFile({
    file,
    folder = "banks",
  }: StorageFileUploadRequest): Promise<StorageFileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post<StorageFileUploadResponse>(
      STORAGE_FILES_PATH,
      formData,
      {
        baseURL: apiEnv.apiBaseUrl,
        timeout: API_REQUEST_TIMEOUT,
        headers: {
          ...getAuthHeaders(),
        },
        params: {
          folder,
        },
      },
    );

    return response.data;
  },
};

