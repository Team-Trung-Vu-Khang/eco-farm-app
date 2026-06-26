import { useMutation } from "@tanstack/react-query";
import { uploadFileApi } from "../api/storage.api";
import type { StorageFileUploadResponse } from "../types/storage-file.type";

export function useFileUpload() {
  const uploadFile = useMutation<
    StorageFileUploadResponse,
    Error,
    { file: File; folder?: string }
  >({
    mutationFn: ({ file, folder }) => uploadFileApi(file, folder),
  });

  return {
    uploadFile,
    isUploading: uploadFile.isPending,
    error: uploadFile.error,
  };
}
