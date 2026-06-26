import { useQuery } from "@tanstack/react-query";
import { bankDirectoryApi } from "../api/bank-directory.api";
import type {
  BankDirectoryItem,
  BankDirectoryQueryParams,
  BankDirectoryResponse,
} from "../types/bank-directory.type";

const EMPTY_QUERY: BankDirectoryQueryParams = {};

interface UseBankDirectoryOptions {
  initialQuery?: BankDirectoryQueryParams;
  enabled?: boolean;
}

const DEFAULT_PAGE_SIZE = 100;

export function useBankDirectory({
  initialQuery = EMPTY_QUERY,
  enabled = true,
}: UseBankDirectoryOptions = {}) {
  const pageSize = Math.min(
    Math.max(initialQuery.size ?? DEFAULT_PAGE_SIZE, 1),
    DEFAULT_PAGE_SIZE,
  );
  const page = initialQuery.page ?? 0;

  const queryResult = useQuery<
    BankDirectoryResponse<BankDirectoryItem>,
    Error
  >({
    queryKey: [
      "bank-directory",
      initialQuery.keyword ?? "",
      initialQuery.transferSupported ?? null,
      initialQuery.lookupSupported ?? null,
      initialQuery.status ?? "",
      page,
      pageSize,
    ],
    queryFn: () =>
      bankDirectoryApi.getBanks({
        ...initialQuery,
        page,
        size: pageSize,
      }),
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
