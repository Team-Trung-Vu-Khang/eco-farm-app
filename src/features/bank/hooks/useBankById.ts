import { useQuery } from "@tanstack/react-query";
import { bankApi } from "../api/bank.api";
import type { BankDirectoryItem } from "../types/bank.type";

interface UseBankByIdOptions {
  enabled?: boolean;
}

export function useBankById(id: number | string | null | undefined, {
  enabled = true,
}: UseBankByIdOptions = {}) {
  const queryResult = useQuery<BankDirectoryItem, Error>({
    queryKey: ["bank-directory", "detail", id ?? ""],
    queryFn: () => {
      if (id === null || id === undefined || id === "") {
        throw new Error("Missing bank directory id");
      }

      return bankApi.getBankById(id);
    },
    enabled: enabled && id !== null && id !== undefined && id !== "",
  });

  return {
    ...queryResult,
    bank: queryResult.data ?? null,
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
    refetch: queryResult.refetch,
  };
}
