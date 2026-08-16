import type { ConversionRuleSupplyType } from "../types/types";

export const SUPPLY_TYPE_LABELS: Record<string, string> = {
  medicine: "Thuốc BVTV",
  fertilizer: "Phân bón",
  material: "Vật tư",
  MEDICINE: "Thuốc BVTV",
  FERTILIZER: "Phân bón",
  MATERIAL: "Vật tư",
};

export const DOMAIN_CODE_LABELS: Record<string, string> = {
  CROP: "Trồng trọt",
  LIVESTOCK: "Chăn nuôi",
  AQUACULTURE: "Thủy sản",
};

export const SUPPLY_TYPE_OPTIONS: {
  value: ConversionRuleSupplyType;
  label: string;
}[] = [
  { value: "medicine", label: "Thuốc BVTV" },
  { value: "fertilizer", label: "Phân bón" },
  { value: "material", label: "Vật tư" },
];

export const DOMAIN_CODE_OPTIONS = [
  { value: "CROP", label: "Trồng trọt" },
  { value: "LIVESTOCK", label: "Chăn nuôi" },
  { value: "AQUACULTURE", label: "Thủy sản" },
];
