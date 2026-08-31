import { farmSupplyApi } from "@/features/farm-supply";
import type {
  DomainCode,
  SupplyItemResponse,
  SupplyType,
} from "@/features/farm-supply/types";
import { useQuery } from "@tanstack/react-query";
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

  const query = useQuery({
    queryKey: [
      "plan-growth",
      "remote-supply-search",
      domainCode,
      type,
      debouncedSearch,
    ] as const,
    queryFn: () =>
      farmSupplyApi.list(type, {
        domainCode,
        status: "active",
        keyword: debouncedSearch || undefined,
        page: 0,
        size: 20,
      }),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  return {
    items: query.data?.content ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
  };
}
