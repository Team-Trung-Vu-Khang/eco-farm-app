import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSelectedWorkspaceId } from "@/features/workspace";

import { bankAccountApi } from "../api/bank-account.api";
import { bankAccountKeys } from "./useBankAccounts";
import type {
  BankAccountCreateRequest,
  BankAccountCreateResponse,
} from "../types/bank-account.type";

interface UseCreateBankAccountOptions {
  onSuccess?: (
    data: BankAccountCreateResponse,
    variables: BankAccountCreateRequest,
  ) => void;
  onError?: (error: Error) => void;
  invalidateList?: boolean;
}

export function useCreateBankAccount({
  onSuccess,
  onError,
  invalidateList = true,
}: UseCreateBankAccountOptions = {}) {
  const queryClient = useQueryClient();
  const workspaceId = useSelectedWorkspaceId();

  const mutation = useMutation<
    BankAccountCreateResponse,
    Error,
    BankAccountCreateRequest
  >({
    mutationFn: (payload) => {
      if (
        workspaceId === null ||
        workspaceId === undefined ||
        workspaceId === ""
      ) {
        throw new Error("Missing workspace id for bank account create");
      }

      return bankAccountApi.create(payload, workspaceId);
    },
    onSuccess: async (data, variables) => {
      if (invalidateList) {
        await queryClient.invalidateQueries({
          queryKey: bankAccountKeys.all,
        });
      }

      onSuccess?.(data, variables);
    },
    onError,
  });

  return {
    ...mutation,
    createBankAccount: mutation.mutateAsync,
  };
}
