import { useQuery } from "@tanstack/react-query";
import { useSelectedWorkspaceId } from "@/features/workspace";

import { bankAccountApi } from "../api/bank-account.api";
import type { BankAccountRecord } from "../types/bank-account.type";

export const bankAccountDetailKeys = {
  all: ["bank-accounts", "detail"] as const,
  byId: (workspaceId: number | string | null | undefined, id: number | string) =>
    ["bank-accounts", "detail", workspaceId ?? "missing", id] as const,
};

interface UseBankAccountByIdOptions {
  enabled?: boolean;
}

export function useBankAccountById(
  id: number | string | null | undefined,
  { enabled = true }: UseBankAccountByIdOptions = {},
) {
  const workspaceId = useSelectedWorkspaceId();

  const queryResult = useQuery<BankAccountRecord, Error>({
    queryKey: bankAccountDetailKeys.byId(workspaceId, id ?? ""),
    queryFn: () => {
      if (
        workspaceId === null ||
        workspaceId === undefined ||
        workspaceId === "" ||
        id === null ||
        id === undefined ||
        id === ""
      ) {
        throw new Error("Missing bank account id or workspace id");
      }

      return bankAccountApi.getById(id, workspaceId);
    },
    enabled:
      enabled &&
      workspaceId !== null &&
      workspaceId !== undefined &&
      workspaceId !== "" &&
      id !== null &&
      id !== undefined &&
      id !== "",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    item: queryResult.data ?? null,
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
  };
}
