export const FOUNDATION_BASE_PATH = "/api/foundation";
export const ADMIN_FOUNDATION_BASE_PATH = "/api/admin/foundation";

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
  adminCropGroups: `${ADMIN_FOUNDATION_BASE_PATH}/production/subject-groups`,
  adminFarmingMethods: `${ADMIN_FOUNDATION_BASE_PATH}/production/methods`,
  adminSoilTypes: `${ADMIN_FOUNDATION_BASE_PATH}/soil-types`,
  adminTerrainFeatures: `${ADMIN_FOUNDATION_BASE_PATH}/terrain-features`,
  adminTerrainParameters: `${ADMIN_FOUNDATION_BASE_PATH}/terrain-parameters`,
  adminCrops: `${ADMIN_FOUNDATION_BASE_PATH}/production/subjects`,
  adminCropVarieties: `${ADMIN_FOUNDATION_BASE_PATH}/production/subject-variants`,
  adminGrowthCycleTemplates: `${ADMIN_FOUNDATION_BASE_PATH}/production/lifecycle-templates`,
  adminFarmingMethodCrops: `${ADMIN_FOUNDATION_BASE_PATH}/production/method-applications`,
  adminLifecycleTemplates: `${ADMIN_FOUNDATION_BASE_PATH}/production/lifecycle-templates`,
} as const;

export const FOUNDATION_CATALOGS = [
  "crop-groups",
  "farming-methods",
  "soil-types",
  "terrain-features",
  "terrain-parameters",
] as const;

export type FoundationCatalog = (typeof FOUNDATION_CATALOGS)[number];
