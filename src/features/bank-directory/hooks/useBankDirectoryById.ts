import { useQuery } from "@tanstack/react-query";
import { bankDirectoryApi } from "../api/bank-directory.api";
import type { BankDirectoryItem } from "../types/bank-directory.type";

interface UseBankByIdOptions {
  enabled?: boolean;
}

export function useBankDirectoryById(
  id: number | string | null | undefined,
  { enabled = true }: UseBankByIdOptions = {},
) {
  const queryResult = useQuery<BankDirectoryItem, Error>({
    queryKey: ["bank-directory", "detail", id ?? ""],
    queryFn: () => {
      if (id === null || id === undefined || id === "") {
        throw new Error("Missing bank directory id");
      }

      return bankDirectoryApi.getBankById(id);
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
