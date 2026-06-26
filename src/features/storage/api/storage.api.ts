import { apiClient } from "@/shared/lib/axios";
import type { StorageFileUploadResponse } from "../types/storage-file.type";

export interface StorageFileUploadRequest {
  file: File;
  folder?: string;
}

export const uploadFileApi = async (
  file: File,
  folder?: string,
): Promise<StorageFileUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<StorageFileUploadResponse>(
    "/api/storage/files",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        folder,
      },
    },
  );

  return response.data;
};
