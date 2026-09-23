import { plantIdentificationApi } from "@/features/farm/api/farm.api";
import { plantKeys } from "@/features/farm/hooks/usePlantIdentifications";
import type { PlantIdentificationQueryParams } from "@/features/farm/types/farm.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const PAGE_SIZE = 20;

/** Danh sách cây trồng theo điều kiện tìm kiếm, tải thêm theo trang */
export function usePlantSearchResults(params: PlantIdentificationQueryParams) {
  const query = useInfiniteQuery({
    queryKey: [...plantKeys.all(), "search-crop", params] as const,
    queryFn: ({ pageParam }) =>
      plantIdentificationApi.list({
        ...params,
        page: pageParam,
        size: PAGE_SIZE,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,
  });

  const plants = useMemo(
    () => query.data?.pages.flatMap((page) => page.content) ?? [],
    [query.data],
  );

  return {
    plants,
    totalElements: query.data?.pages[0]?.totalElements ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
  };
}
