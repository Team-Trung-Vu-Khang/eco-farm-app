import { useQuery } from "@tanstack/react-query";
import { bankApi } from "../api/bank.api";
import type {
  BankDirectoryItem,
  BankDirectoryQueryParams,
  BankDirectoryResponse,
} from "../types/bank.type";

const EMPTY_QUERY: BankDirectoryQueryParams = {};

interface UseBankDirectoryOptions {
  initialQuery?: BankDirectoryQueryParams;
  enabled?: boolean;
}

type UseBankDirectoryResult = ReturnType<
  typeof useQuery<BankDirectoryResponse<BankDirectoryItem>, Error>
>;

export function useBankDirectory({
  initialQuery = EMPTY_QUERY,
  enabled = true,
}: UseBankDirectoryOptions = {}) {
  const queryResult: UseBankDirectoryResult = useQuery<
    BankDirectoryResponse<BankDirectoryItem>,
    Error
  >({
    queryKey: [
      "bank-directory",
      initialQuery.keyword ?? "",
      initialQuery.transferSupported ?? null,
      initialQuery.lookupSupported ?? null,
      initialQuery.status ?? "",
      initialQuery.page ?? null,
      initialQuery.size ?? null,
    ],
    queryFn: () => bankApi.getBanks(initialQuery),
    enabled,
  });

  return {
    ...queryResult,
    banks: queryResult.data?.content ?? [],
    response: queryResult.data ?? null,
    loading: queryResult.isLoading,
    error: queryResult.error?.message ?? null,
    refetch: queryResult.refetch,
  };
}
