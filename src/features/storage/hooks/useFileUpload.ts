import { useMutation } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace/hooks/useSelectedWorkspaceId";
import { uploadFileApi } from "../api/storage.api";
import type { StorageFileUploadResponse } from "../types/storage-file.type";

type UploadFileInput = {
  file: File;
  folder?: string;
};

export function useFileUpload() {
  const workspaceId = useSelectedWorkspaceId();
  const uploadFile = useMutation<
    StorageFileUploadResponse,
    Error,
    UploadFileInput
  >({
    mutationFn: (payload) =>
      uploadFileApi({
        ...payload,
        workspaceId,
      }),
  });

  return {
    uploadFile,
    isUploading: uploadFile.isPending,
    error: uploadFile.error,
  };
}
