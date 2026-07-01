import { useQuery } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace";

import { bankAccountApi } from "../api/bank-account.api";
import type {
  BankAccountPageResponse,
  BankAccountQueryParams,
  BankAccountRecord,
} from "../types/bank-account.type";

export const bankAccountKeys = {
  all: ["bank-accounts"] as const,
  list: (
    workspaceId: number | string | null | undefined,
    params?: BankAccountQueryParams,
  ) => ["bank-accounts", "list", workspaceId ?? "missing", params ?? {}] as const,
};

interface UseBankAccountsOptions {
  params?: BankAccountQueryParams;
  enabled?: boolean;
}

export function useBankAccounts({
  params,
  enabled = true,
}: UseBankAccountsOptions = {}) {
  const workspaceId = useSelectedWorkspaceId();

  const queryResult = useQuery<BankAccountPageResponse<BankAccountRecord>, Error>({
    queryKey: bankAccountKeys.list(workspaceId, params),
    queryFn: () => {
      if (
        workspaceId === null ||
        workspaceId === undefined ||
        workspaceId === ""
      ) {
        throw new Error("Missing workspace id for bank accounts");
      }

      return bankAccountApi.list(params, workspaceId);
    },
    enabled:
      enabled &&
      workspaceId !== null &&
      workspaceId !== undefined &&
      workspaceId !== "",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    items: queryResult.data?.content ?? [],
    response: queryResult.data ?? null,
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}
