import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bankDirectoryApi } from "../api/bank-directory.api";
import type {
  BankDirectoryUpdateRequest,
  BankDirectoryUpdateResponse,
} from "../types/bank-directory.type";

interface UseUpdateBankOptions {
  onSuccess?: (
    data: BankDirectoryUpdateResponse,
    variables: { id: number | string; payload: BankDirectoryUpdateRequest },
  ) => void;
  onError?: (error: Error) => void;
  invalidateDirectory?: boolean;
  invalidateDetail?: boolean;
}

export function useUpdateBankDirectory({
  onSuccess,
  onError,
  invalidateDirectory = true,
  invalidateDetail = true,
}: UseUpdateBankOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    BankDirectoryUpdateResponse,
    Error,
    { id: number | string; payload: BankDirectoryUpdateRequest }
  >({
    mutationFn: ({ id, payload }) => bankDirectoryApi.updateBank(id, payload),
    onSuccess: async (data, variables) => {
      if (invalidateDirectory) {
        await queryClient.invalidateQueries({
          queryKey: ["bank-directory"],
        });
      }

      if (invalidateDetail) {
        await queryClient.invalidateQueries({
          queryKey: ["bank-directory", "detail", variables.id],
        });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    updateBankDirectory: mutation.mutateAsync,
  };
}
