export const FOUNDATION_BASE_PATH = "/api/admin/foundation";

export const FOUNDATION_ENDPOINTS = {
  cropGroups: `${FOUNDATION_BASE_PATH}/production/subject-groups`,
  farmingMethods: `${FOUNDATION_BASE_PATH}/production/methods`,
  soilTypes: `${FOUNDATION_BASE_PATH}/soil-types`,
  terrainFeatures: `${FOUNDATION_BASE_PATH}/terrain-features`,
  terrainParameters: `${FOUNDATION_BASE_PATH}/terrain-parameters`,
  crops: `${FOUNDATION_BASE_PATH}/production/subjects`,
  cropVarieties: `${FOUNDATION_BASE_PATH}/production/subject-variants`,
  growthCycleTemplates: `${FOUNDATION_BASE_PATH}/production/lifecycle-templates`,
  farmingMethodCrops: `${FOUNDATION_BASE_PATH}/production/method-applications`,
  lifecycleTemplates: `${FOUNDATION_BASE_PATH}/production/lifecycle-templates`,
} as const;

export const FOUNDATION_CATALOGS = [
  "crop-groups",
  "farming-methods",
  "soil-types",
  "terrain-features",
  "terrain-parameters",
] as const;

export type FoundationCatalog = (typeof FOUNDATION_CATALOGS)[number];
