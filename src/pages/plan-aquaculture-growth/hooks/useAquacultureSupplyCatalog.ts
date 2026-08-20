import { farmSupplyApi } from "@/features/farm-supply";
import type {
  SupplyItemResponse,
  SupplyType,
} from "@/features/farm-supply/types";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import type { MaterialAllocation } from "../types";

// Aquaculture (AQUACULTURE domain) only has 3 supply categories on the backend —
// unlike crop, which also has "fertilizer" — so it's excluded here rather
// than queried and left permanently empty.
export type AquacultureSupplyType = Exclude<SupplyType, "fertilizer">;

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
  { value: "medicine", label: "Thuốc thủy sản" },
  { value: "material", label: "Vật tư khác" },
  { value: "equipment", label: "Dụng cụ - Máy móc" },
];

const DEFAULT_UNITS: Record<AquacultureSupplyType, string[]> = {
  medicine: ["chai", "gói", "lít", "ml", "can"],
  material: ["cái", "bộ", "cuộn", "thùng", "bao"],
  equipment: ["cái", "bộ", "đôi", "chiếc", "máy"],
};

function getDefaultUnit(item: SupplyItemResponse, type: AquacultureSupplyType) {
  const firstPackagingUnit = item.packagingVariants?.[0]?.unitBase?.name;
  if (firstPackagingUnit) return firstPackagingUnit;
  return DEFAULT_UNITS[type][0] || "cái";
}

// A material allocation loaded from the API can come back with an empty
// `unit` string even though it has a real `unitBaseId` — e.g. the backend
// didn't resolve/include the packaging variant's unit name on that supply
// line. Re-derive the unit label from the catalog by matching supplyItemId +
// unitBaseId instead of trusting the possibly-missing `unit` field.
//
// Search every supply type rather than narrowing by `allocation.materialType`
// first: allocations loaded from the API store the raw SupplyType there
// (e.g. "material"), but ones added client-side this session store the
// display label (e.g. "Vật tư khác") — matching against just one of those
// would silently miss the other.
export function resolveMaterialUnit(
  allocation: Pick<MaterialAllocation, "unit" | "supplyItemId" | "unitBaseId">,
  catalog: AquacultureSupplyCatalog,
): string {
  if (allocation.unit) return allocation.unit;
  if (allocation.supplyItemId == null || allocation.unitBaseId == null) {
    return "";
  }

  for (const typeOption of catalog.typeOptions) {
    const material = catalog.optionsByType[typeOption.value].find(
      (option) => option.value === String(allocation.supplyItemId),
    );
    const variant = material?.item.packagingVariants?.find(
      (item) => item.unitBase?.id === allocation.unitBaseId,
    );
    if (variant?.unitBase?.name) return variant.unitBase.name;
  }

  return "";
}

export function useAquacultureSupplyCatalog(): AquacultureSupplyCatalog {
  const queries = useQueries({
    queries: AQUACULTURE_SUPPLY_TYPE_OPTIONS.map((typeOption) => ({
      queryKey: ["plan-aquaculture-growth", "aquaculture-supply-catalog", typeOption.value],
      queryFn: () =>
        farmSupplyApi.list(typeOption.value, {
          domainCode: "AQUACULTURE",
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
