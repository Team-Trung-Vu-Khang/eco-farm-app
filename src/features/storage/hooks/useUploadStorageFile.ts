import { useMutation } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace/hooks/useSelectedWorkspaceId";
import {
  uploadFileApi,
  type StorageFileUploadRequest,
} from "../api/storage.api";
import type { StorageFileUploadResponse } from "../types/storage-file.type";

type UploadStorageFileInput = Pick<StorageFileUploadRequest, "file" | "folder">;

interface UseUploadStorageFileOptions {
  onSuccess?: (
    data: StorageFileUploadResponse,
    variables: UploadStorageFileInput,
  ) => void;
  onError?: (error: Error) => void;
}

export function useUploadStorageFile({
  onSuccess,
  onError,
}: UseUploadStorageFileOptions = {}) {
  const workspaceId = useSelectedWorkspaceId();
  const mutation = useMutation<
    StorageFileUploadResponse,
    Error,
    UploadStorageFileInput
  >({
    mutationFn: (payload) =>
      uploadFileApi({
        ...payload,
        workspaceId,
      }),
    onSuccess: (data, variables, context) => {
      onSuccess?.(data, variables);
      return context;
    },
    onError,
  });

  return {
    ...mutation,
    uploadStorageFile: mutation.mutateAsync,
  };
}
