import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSelectedWorkspaceId } from "@/features/workspace";

import { bankAccountApi } from "../api/bank-account.api";
import { bankAccountDetailKeys } from "./useBankAccountById";
import { bankAccountKeys } from "./useBankAccounts";

interface UseDeleteBankAccountOptions {
  onSuccess?: (data: void, variables: number | string) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
  invalidateDetail?: boolean;
}

export function useDeleteBankAccount({
  onSuccess,
  onError,
  invalidateList = true,
  invalidateDetail = true,
}: UseDeleteBankAccountOptions = {}) {
  const queryClient = useQueryClient();
  const workspaceId = useSelectedWorkspaceId();

  const mutation = useMutation<void, Error, number | string>({
    mutationFn: (id) => {
      if (
        workspaceId === null ||
        workspaceId === undefined ||
        workspaceId === ""
      ) {
        throw new Error("Missing workspace id for bank account delete");
      }

      return bankAccountApi.delete({
        id,
        workspaceId,
      });
    },
    onSuccess: async (data, id) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({
          queryKey: bankAccountKeys.all,
        });
      }

      if (invalidateDetail) {
        await queryClient.invalidateQueries({
          queryKey: bankAccountDetailKeys.byId(workspaceId, id),
        });
      }

      onSuccess?.(data, id);
    },
    onError,
  });

  return {
    ...mutation,
    deleteBankAccount: mutation.mutateAsync,
  };
}
