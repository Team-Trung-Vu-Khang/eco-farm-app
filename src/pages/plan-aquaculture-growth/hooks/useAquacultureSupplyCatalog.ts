import { farmSupplyApi } from "@/features/farm-supply";
import type {
  DomainCode,
  SupplyItemResponse,
  SupplyType,
} from "@/features/farm-supply/types";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

export type AquacultureSupplyType = SupplyType;

export type AquacultureSupplyTypeOption = {
  value: AquacultureSupplyType;
  label: string;
};

export type AquacultureSupplyOption = {
  value: string;
  label: string;
  unit: string;
  item: SupplyItemResponse;
};

export type AquacultureSupplyCatalog = {
  typeOptions: AquacultureSupplyTypeOption[];
  optionsByType: Record<AquacultureSupplyType, AquacultureSupplyOption[]>;
  unitOptionsByType: Record<AquacultureSupplyType, string[]>;
  isLoading: boolean;
  isError: boolean;
};

const AQUACULTURE_SUPPLY_TYPE_OPTIONS: AquacultureSupplyTypeOption[] = [
  { value: "medicine", label: "Thuốc" },
  { value: "material", label: "Vật tư khác" },
  { value: "equipment", label: "Dụng cụ - Máy móc" },
];

const DEFAULT_UNITS: Record<AquacultureSupplyType, string[]> = {
  medicine: ["chai", "gói", "lít", "ml", "can"],
  fertilizer: ["kg", "bao", "tấn", "lít", "chai"],
  material: ["cái", "bộ", "cuộn", "thùng", "bao"],
  equipment: ["cái", "bộ", "đôi", "chiếc", "máy"],
};

function getDefaultUnit(item: SupplyItemResponse, type: AquacultureSupplyType) {
  const firstPackagingUnit = item.packagingVariants?.[0]?.unitBase?.name;
  if (firstPackagingUnit) return firstPackagingUnit;
  return DEFAULT_UNITS[type][0] || "cái";
}

export function useAquacultureSupplyCatalog(domainCode: DomainCode = "AQUACULTURE"): AquacultureSupplyCatalog {
  const queries = useQueries({
    queries: AQUACULTURE_SUPPLY_TYPE_OPTIONS.map((typeOption) => ({
      queryKey: ["plan-aquaculture-growth", "supply-catalog", domainCode, typeOption.value],
      queryFn: () =>
        farmSupplyApi.list(typeOption.value, {
          domainCode,
          status: "active",
          page: 0,
          size: 100,
        }),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    })),
  });

  const optionsByType = useMemo(() => {
    return AQUACULTURE_SUPPLY_TYPE_OPTIONS.reduce(
      (acc, typeOption, index) => {
        const items = queries[index]?.data?.content ?? [];
        acc[typeOption.value] = items.map((item) => ({
          value: String(item.id),
          label: item.name,
          unit: getDefaultUnit(item, typeOption.value),
          item,
        }));
        return acc;
      },
      {
        medicine: [],
        fertilizer: [],
        material: [],
        equipment: [],
      } as Record<AquacultureSupplyType, AquacultureSupplyOption[]>,
    );
  }, [queries]);

  const unitOptionsByType = useMemo(() => {
    return AQUACULTURE_SUPPLY_TYPE_OPTIONS.reduce(
      (acc, typeOption, index) => {
        const items = queries[index]?.data?.content ?? [];
        const units = items
          .flatMap((item) =>
            item.packagingVariants?.map((variant) => variant.unitBase?.name),
          )
          .filter(Boolean) as string[];
        acc[typeOption.value] = Array.from(
          new Set([...units, ...DEFAULT_UNITS[typeOption.value]]),
        );
        return acc;
      },
      {
        medicine: [],
        fertilizer: [],
        material: [],
        equipment: [],
      } as Record<AquacultureSupplyType, string[]>,
    );
  }, [queries]);

  return {
    typeOptions: AQUACULTURE_SUPPLY_TYPE_OPTIONS,
    optionsByType,
    unitOptionsByType,
    isLoading: queries.some((query) => query.isLoading),
    isError: queries.some((query) => query.isError),
  };
}
