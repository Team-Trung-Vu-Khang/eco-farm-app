import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bankApi } from "../api/bank.api";
import type {
  BankDirectoryUpdateRequest,
  BankDirectoryUpdateResponse,
} from "../types/bank.type";

interface UseUpdateBankOptions {
  onSuccess?: (
    data: BankDirectoryUpdateResponse,
    variables: { id: number | string; payload: BankDirectoryUpdateRequest },
  ) => void;
  onError?: (error: Error) => void;
  invalidateDirectory?: boolean;
  invalidateDetail?: boolean;
}

export function useUpdateBank({
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
    mutationFn: ({ id, payload }) => bankApi.updateBank(id, payload),
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
    updateBank: mutation.mutateAsync,
  };
}
