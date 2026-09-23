export const MATERIAL_CLASSIFICATIONS = [
  "technology_level",
  "value_chain",
  "financial_aspect",
] as const;

export const FERTILIZER_CLASSIFICATIONS = [
  "nutrient_composition",
  "origin",
  "effect_stage",
  "physical_form",
] as const;

export const MEDICINE_CLASSIFICATIONS = [
  "target_group",
  "dosage_form",
  "toxicity",
  "mode_of_action",
  "origin",
  "usage_method",
] as const;

export type MaterialClassification =
  (typeof MATERIAL_CLASSIFICATIONS)[number];
export type FertilizerClassification =
  (typeof FERTILIZER_CLASSIFICATIONS)[number];
export type MedicineClassification = (typeof MEDICINE_CLASSIFICATIONS)[number];

export const SUPPLY_CLASSIFICATIONS = {
  material: MATERIAL_CLASSIFICATIONS,
  equipment: MATERIAL_CLASSIFICATIONS,
  fertilizer: FERTILIZER_CLASSIFICATIONS,
  medicine: MEDICINE_CLASSIFICATIONS,
  biological: FERTILIZER_CLASSIFICATIONS,
} as const;