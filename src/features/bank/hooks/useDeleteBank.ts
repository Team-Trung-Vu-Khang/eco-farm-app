import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bankApi } from "../api/bank.api";

interface UseDeleteBankOptions {
  onSuccess?: (data: void, variables: number | string) => void;
  onError?: (error: Error) => void;
  invalidateDirectory?: boolean;
  invalidateDetail?: boolean;
}

export function useDeleteBank({
  onSuccess,
  onError,
  invalidateDirectory = true,
  invalidateDetail = true,
}: UseDeleteBankOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, number | string>({
    mutationFn: (id) => bankApi.deleteBank(id),
    onSuccess: async (data, variables) => {
      if (invalidateDirectory) {
        await queryClient.invalidateQueries({
          queryKey: ["bank-directory"],
        });
      }

      if (invalidateDetail) {
        await queryClient.invalidateQueries({
          queryKey: ["bank-directory", "detail", variables],
        });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    deleteBank: mutation.mutateAsync,
  };
}
