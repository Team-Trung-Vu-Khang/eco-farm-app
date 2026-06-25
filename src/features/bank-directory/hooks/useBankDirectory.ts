import { useEffect, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
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

const DEFAULT_PAGE_SIZE = 100;

export function useBankDirectory({
  initialQuery = EMPTY_QUERY,
  enabled = true,
}: UseBankDirectoryOptions = {}) {
  const pageSize = Math.min(
    Math.max(initialQuery.size ?? DEFAULT_PAGE_SIZE, 1),
    DEFAULT_PAGE_SIZE,
  );
  const initialPage = initialQuery.page ?? 0;

  const queryResult = useInfiniteQuery<
    BankDirectoryResponse<BankDirectoryItem>,
    Error
  >({
    queryKey: [
      "bank-directory",
      initialQuery.keyword ?? "",
      initialQuery.transferSupported ?? null,
      initialQuery.lookupSupported ?? null,
      initialQuery.status ?? "",
      initialPage,
      pageSize,
    ],
    queryFn: ({ pageParam = initialPage }) =>
      bankApi.getBanks({
        ...initialQuery,
        page: pageParam as number,
        size: pageSize,
      }),
    initialPageParam: initialPage,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,
    enabled,
  });

  useEffect(() => {
    if (queryResult.hasNextPage && !queryResult.isFetchingNextPage) {
      void queryResult.fetchNextPage();
    }
  }, [
    queryResult.fetchNextPage,
    queryResult.hasNextPage,
    queryResult.isFetchingNextPage,
  ]);

  const banks = useMemo(
    () => queryResult.data?.pages.flatMap((page) => page.content) ?? [],
    [queryResult.data],
  );

  return {
    ...queryResult,
    banks,
    response: queryResult.data?.pages.at(-1) ?? null,
    loading: queryResult.isLoading || queryResult.isFetchingNextPage,
    error: queryResult.error?.message ?? null,
    refetch: queryResult.refetch,
  };
}
