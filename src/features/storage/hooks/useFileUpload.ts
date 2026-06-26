import { useMutation } from "@tanstack/react-query";
import { uploadFileApi, type StorageFileResponse } from "../api/storage.api";

export function useFileUpload() {
  const uploadFile = useMutation<
    StorageFileResponse,
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
