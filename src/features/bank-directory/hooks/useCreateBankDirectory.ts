import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bankDirectoryApi } from "../api/bank-directory.api";
import type {
  BankDirectoryCreateRequest,
  BankDirectoryCreateResponse,
} from "../types/bank-directory.type";

interface UseCreateBankOptions {
  onSuccess?: (
    data: BankDirectoryCreateResponse,
    variables: BankDirectoryCreateRequest,
  ) => void;
  onError?: (error: Error) => void;
  invalidateDirectory?: boolean;
}

export function useCreateBankDirectory({
  onSuccess,
  onError,
  invalidateDirectory = true,
}: UseCreateBankOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    BankDirectoryCreateResponse,
    Error,
    BankDirectoryCreateRequest
  >({
    mutationFn: (payload) => bankDirectoryApi.createBank(payload),
    onSuccess: async (data, variables, context) => {
      if (invalidateDirectory) {
        await queryClient.invalidateQueries({
          queryKey: ["bank-directory"],
        });
      }

      onSuccess?.(data, variables);
      return context;
    },
    onError,
  });

  return {
    ...mutation,
    createBankDirectory: mutation.mutateAsync,
  };
}
