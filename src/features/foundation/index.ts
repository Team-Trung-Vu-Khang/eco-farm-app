// ─── Types ────────────────────────────────────────────────────────────────────
export * from "./types/foundation.type";

// ─── API ──────────────────────────────────────────────────────────────────────
export * from "./api/foundation.api";

// ─── Query Hooks ──────────────────────────────────────────────────────────────
export { useCatalog, useCatalogById, catalogKeys } from "./hooks/useCatalog";
export { useCrops, useCropById, cropKeys } from "./hooks/useCrops";
export {
  useCropVarieties,
  useCropVarietyById,
  cropVarietyKeys,
} from "./hooks/useCropVarieties";
export {
  useGrowthCycleTemplates,
  useGrowthCycleTemplateById,
  growthCycleTemplateKeys,
  useUserGrowthCycleTemplates,
  useSystemGrowthCycleTemplates,
  useUserGrowthCycleTemplateById,
  useSystemGrowthCycleTemplateById,
  userGrowthCycleTemplateKeys,
  systemGrowthCycleTemplateKeys,
} from "./hooks/useGrowthCycleTemplates";
export {
  useFarmingMethodCrops,
  useFarmingMethodCropById,
  farmingMethodCropKeys,
} from "./hooks/useFarmingMethodCrops";
export {
  useMethodApplications,
  useMethodApplicationById,
  methodApplicationKeys,
} from "./hooks/useMethodApplications";
export {
  useLifecycleTemplates,
  useLifecycleTemplateById,
  lifecycleTemplateKeys,
  useUserLifecycleTemplates,
  useUserLifecycleTemplateById,
  userLifecycleTemplateKeys,
} from "./hooks/useLifecycleTemplates";

// ─── Production Subjects & Variants Hooks ──────────────────────────────────────
export {
  useProductionSubjects,
  useProductionSubjectById,
  useProductionSubjectVariants,
  useProductionSubjectVariantById,
  useProductionMethods,
  useProductionMethodById,
  productionSubjectKeys,
  productionSubjectVariantKeys,
  productionMethodKeys,
} from "./hooks/useProductionSubjects";
export {
  useProductionSubjectGroups,
  subjectGroupKeys,
} from "./hooks/useProductionSubjectGroups";

// ─── Mutation Hooks ───────────────────────────────────────────────────────────
export { useCatalogMutations } from "./hooks/useCatalogMutations";
export { useCropMutations } from "./hooks/useCropMutations";
export { useCropVarietyMutations } from "./hooks/useCropVarietyMutations";
export { useGrowthCycleTemplateMutations, useUserGrowthCycleTemplateMutations } from "./hooks/useGrowthCycleTemplateMutations";
export { useFarmingMethodCropMutations } from "./hooks/useFarmingMethodCropMutations";
export { useLifecycleTemplateMutations, useUserLifecycleTemplateMutations } from "./hooks/useLifecycleTemplateMutations";
export { useProductionSubjectGroupMutations } from "./hooks/useProductionSubjectGroups";

// ─── Constants ────────────────────────────────────────────────────────────────
export * from "@/shared/constants/foundation.constants";
