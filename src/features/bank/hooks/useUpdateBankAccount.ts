import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSelectedWorkspaceId } from "@/features/workspace";

import { bankAccountApi } from "../api/bank-account.api";
import { bankAccountDetailKeys } from "./useBankAccountById";
import { bankAccountKeys } from "./useBankAccounts";
import type {
  BankAccountUpdateRequest,
  BankAccountUpdateResponse,
} from "../types/bank-account.type";

interface UseUpdateBankAccountOptions {
  onSuccess?: (
    data: BankAccountUpdateResponse,
    variables: { id: number | string; payload: BankAccountUpdateRequest },
  ) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
  invalidateDetail?: boolean;
}

export function useUpdateBankAccount({
  onSuccess,
  onError,
  invalidateList = true,
  invalidateDetail = true,
}: UseUpdateBankAccountOptions = {}) {
  const queryClient = useQueryClient();
  const workspaceId = useSelectedWorkspaceId();

  const mutation = useMutation<
    BankAccountUpdateResponse,
    Error,
    { id: number | string; payload: BankAccountUpdateRequest }
  >({
    mutationFn: ({ id, payload }) => {
      if (
        workspaceId === null ||
        workspaceId === undefined ||
        workspaceId === ""
      ) {
        throw new Error("Missing workspace id for bank account update");
      }

      return bankAccountApi.update(id, payload, workspaceId);
    },
    onSuccess: async (data, variables) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({
          queryKey: bankAccountKeys.all,
        });
      }

      if (invalidateDetail) {
        await queryClient.invalidateQueries({
          queryKey: bankAccountDetailKeys.byId(workspaceId, variables.id),
        });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    updateBankAccount: mutation.mutateAsync,
  };
}
