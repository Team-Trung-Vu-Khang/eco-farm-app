import { farmSupplyApi } from "@/features/farm-supply";
import type {
  DomainCode,
  SupplyItemResponse,
  SupplyType,
} from "@/features/farm-supply/types";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

export type CropSupplyType = SupplyType;

export type CropSupplyTypeOption = {
  value: CropSupplyType;
  label: string;
};

export type CropSupplyOption = {
  value: string;
  label: string;
  unit: string;
  item: SupplyItemResponse;
};

export type CropSupplyCatalog = {
  typeOptions: CropSupplyTypeOption[];
  optionsByType: Record<CropSupplyType, CropSupplyOption[]>;
  unitOptionsByType: Record<CropSupplyType, string[]>;
  isLoading: boolean;
  isError: boolean;
};

const CROP_SUPPLY_TYPE_OPTIONS: CropSupplyTypeOption[] = [
  { value: "medicine", label: "Thuốc BVTV" },
  { value: "fertilizer", label: "Phân bón" },
  { value: "material", label: "Vật tư khác" },
  { value: "equipment", label: "Dụng cụ - Máy móc" },
];

const DEFAULT_UNITS: Record<CropSupplyType, string[]> = {
  medicine: ["chai", "gói", "lít", "ml", "can"],
  fertilizer: ["kg", "bao", "tấn", "lít", "chai"],
  material: ["cái", "bộ", "cuộn", "thùng", "bao"],
  equipment: ["cái", "bộ", "đôi", "chiếc", "máy"],
};

function getDefaultUnit(item: SupplyItemResponse, type: CropSupplyType) {
  const firstPackagingUnit = item.packagingVariants?.[0]?.unitBase?.name;
  if (firstPackagingUnit) return firstPackagingUnit;
  return DEFAULT_UNITS[type][0] || "cái";
}

export function useCropSupplyCatalog(domainCode: DomainCode = "CROP"): CropSupplyCatalog {
  const queries = useQueries({
    queries: CROP_SUPPLY_TYPE_OPTIONS.map((typeOption) => ({
      queryKey: ["plan-growth", "supply-catalog", domainCode, typeOption.value],
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
    return CROP_SUPPLY_TYPE_OPTIONS.reduce(
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
      } as Record<CropSupplyType, CropSupplyOption[]>,
    );
  }, [queries]);

  const unitOptionsByType = useMemo(() => {
    return CROP_SUPPLY_TYPE_OPTIONS.reduce(
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
      } as Record<CropSupplyType, string[]>,
    );
  }, [queries]);

  return {
    typeOptions: CROP_SUPPLY_TYPE_OPTIONS,
    optionsByType,
    unitOptionsByType,
    isLoading: queries.some((query) => query.isLoading),
    isError: queries.some((query) => query.isError),
  };
}
