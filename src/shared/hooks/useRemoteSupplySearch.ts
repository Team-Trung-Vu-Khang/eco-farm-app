import { farmSupplyApi } from "@/features/farm-supply";
import type {
  DomainCode,
  SupplyItemResponse,
  SupplyType,
} from "@/features/farm-supply/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDebounce } from "./useDebounce";

export type SupplyTypeOption = {
  value: SupplyType;
  label: string;
};

export type SupplyAutocompleteOption = {
  value: string;
  label: string;
  item: SupplyItemResponse;
};

const SUPPLY_TYPE_OPTIONS_BY_DOMAIN: Record<DomainCode, SupplyTypeOption[]> = {
  CROP: [
    { value: "medicine", label: "Thuốc BVTV" },
    { value: "fertilizer", label: "Phân bón" },
    { value: "material", label: "Vật tư khác" },
    { value: "equipment", label: "Dụng cụ - Máy móc" },
  ],
  LIVESTOCK: [
    { value: "medicine", label: "Thuốc thú y" },
    { value: "material", label: "Vật tư khác" },
    { value: "equipment", label: "Dụng cụ - Máy móc" },
  ],
  AQUACULTURE: [
    { value: "medicine", label: "Thuốc" },
    { value: "material", label: "Vật tư khác" },
    { value: "equipment", label: "Dụng cụ - Máy móc" },
  ],
};

export function getSupplyTypeOptions(domainCode: DomainCode) {
  return SUPPLY_TYPE_OPTIONS_BY_DOMAIN[domainCode];
}

export function isEquipmentSupplyType(type: SupplyType) {
  return type === "equipment";
}

export function mapSupplyItemToOption(item: SupplyItemResponse) {
  return {
    value: String(item.id),
    label: item.name,
    item,
  };
}

export function useRemoteSupplySearch(
  domainCode: DomainCode,
  type: SupplyType,
  searchValue: string,
) {
  const debouncedSearch = useDebounce(searchValue.trim(), 300);

  const query = useInfiniteQuery({
    queryKey: [
      "plan-growth",
      "remote-supply-search",
      domainCode,
      type,
      debouncedSearch,
    ] as const,
    queryFn: ({ pageParam = 0 }) =>
      farmSupplyApi.list(type, {
        domainCode,
        status: "active",
        keyword: debouncedSearch || undefined,
        page: pageParam,
        size: 20,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.last || !lastPage.content) {
        return undefined;
      }
      const pageNum = typeof lastPage.page === "number" ? lastPage.page : 0;
      if (lastPage.totalPages && pageNum >= lastPage.totalPages - 1) {
        return undefined;
      }
      return pageNum + 1;
    },
    initialPageParam: 0,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.content) ?? [],
    [query.data],
  );

  const totalElements = query.data?.pages[0]?.totalElements ?? 0;

  return {
    items,
    totalElements,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isError: query.isError,
  };
}
