import { apiClient } from "@/shared/lib/axios";

export interface StorageFileResponse {
  id?: number;
  fileUrl: string;
  fileName: string;
  url?: string; // fallback
  name?: string;
  originalName?: string;
}

export const uploadFileApi = async (
  file: File,
  folder?: string,
): Promise<StorageFileResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<StorageFileResponse>(
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
