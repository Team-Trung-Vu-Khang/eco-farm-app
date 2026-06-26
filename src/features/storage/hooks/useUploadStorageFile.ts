import { useMutation } from "@tanstack/react-query";
import { storageApi, type StorageFileUploadRequest } from "../api/storage.api";
import type { StorageFileUploadResponse } from "../types/storage-file.type";

interface UseUploadStorageFileOptions {
  onSuccess?: (
    data: StorageFileUploadResponse,
    variables: StorageFileUploadRequest,
  ) => void;
  onError?: (error: Error) => void;
}

export function useUploadStorageFile({
  onSuccess,
  onError,
}: UseUploadStorageFileOptions = {}) {
  const mutation = useMutation<
    StorageFileUploadResponse,
    Error,
    StorageFileUploadRequest
  >({
    mutationFn: (payload) => storageApi.uploadFile(payload),
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

