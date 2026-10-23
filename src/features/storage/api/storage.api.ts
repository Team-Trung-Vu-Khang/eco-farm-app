import { apiClient } from "@/shared/lib/axios";
import { STORAGE_API_PATHS } from "@/shared/constants";
import type { StorageFileUploadResponse } from "../types/storage-file.type";

export interface StorageFileUploadRequest {
  file: File;
  folder?: string;
  workspaceId?: number | string | null;
}

export const uploadFileApi = async ({
  file,
  folder,
  workspaceId,
}: StorageFileUploadRequest): Promise<StorageFileUploadResponse> => {
  if (workspaceId === null || workspaceId === undefined || workspaceId === "") {
    throw new Error("Missing workspace id for file upload.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<StorageFileUploadResponse>(
    STORAGE_API_PATHS.files,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-Workspace-Id": String(workspaceId),
      },
      params: {
        folder,
      },
    },
  );

  return response.data;
};
