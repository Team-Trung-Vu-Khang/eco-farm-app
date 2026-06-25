import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bankApi } from "../api/bank.api";
import type {
  BankDirectoryCreateRequest,
  BankDirectoryCreateResponse,
} from "../types/bank.type";

interface UseCreateBankOptions {
  onSuccess?: (
    data: BankDirectoryCreateResponse,
    variables: BankDirectoryCreateRequest,
  ) => void;
  onError?: (error: Error) => void;
  invalidateDirectory?: boolean;
}

export function useCreateBank({
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
    mutationFn: (payload) => bankApi.createBank(payload),
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
    createBank: mutation.mutateAsync,
  };
}
