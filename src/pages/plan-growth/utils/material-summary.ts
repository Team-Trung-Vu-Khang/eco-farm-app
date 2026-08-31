import type { DomainCode, SupplyType } from "@/features/farm-supply/types";
import type { MaterialAllocation } from "../types";

type MaterialSummaryItem = {
  label: string;
  value: number;
};

const MATERIAL_SUMMARY_CONFIG: Record<
  DomainCode,
  readonly { type: SupplyType; label: string }[]
> = {
  CROP: [
    { type: "medicine", label: "Thuốc BVTV" },
    { type: "fertilizer", label: "Phân bón" },
    { type: "material", label: "Vật tư khác" },
    { type: "equipment", label: "Thiết bị máy móc" },
  ],
  LIVESTOCK: [
    { type: "medicine", label: "Thuốc thú y" },
    { type: "material", label: "Vật tư khác" },
    { type: "equipment", label: "Dụng cụ - Máy móc" },
  ],
  AQUACULTURE: [
    { type: "medicine", label: "Thuốc" },
    { type: "material", label: "Vật tư khác" },
    { type: "equipment", label: "Dụng cụ - Máy móc" },
  ],
};

function resolveSupplyType(item: MaterialAllocation): SupplyType | undefined {
  if (item.supplyType) return item.supplyType;

  const text = `${item.materialCategory || ""} ${item.materialType || ""} ${item.materialName || ""}`.toLowerCase();
  if (text.includes("thuốc") || text.includes("bvtv")) return "medicine";
  if (text.includes("phân")) return "fertilizer";
  if (text.includes("equipment") || text.includes("dụng cụ") || text.includes("máy")) {
    return "equipment";
  }
  if (text.trim()) return "material";
  return undefined;
}

export function getMaterialSummaryItems(
  materials: MaterialAllocation[],
  domainCode: DomainCode,
): MaterialSummaryItem[] {
  const counts = new Map<SupplyType, number>([
    ["medicine", 0],
    ["fertilizer", 0],
    ["material", 0],
    ["equipment", 0],
  ]);

  materials.forEach((item) => {
    const supplyType = resolveSupplyType(item);
    if (!supplyType) return;
    counts.set(supplyType, (counts.get(supplyType) || 0) + 1);
  });

  return MATERIAL_SUMMARY_CONFIG[domainCode].map((entry) => ({
    label: entry.label,
    value: counts.get(entry.type) || 0,
  }));
}
