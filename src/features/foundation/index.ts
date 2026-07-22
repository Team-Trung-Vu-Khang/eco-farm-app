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
} from "./hooks/useGrowthCycleTemplates";
export {
  useFarmingMethodCrops,
  useFarmingMethodCropById,
  farmingMethodCropKeys,
} from "./hooks/useFarmingMethodCrops";
export {
  useLifecycleTemplates,
  useLifecycleTemplateById,
  lifecycleTemplateKeys,
} from "./hooks/useLifecycleTemplates";

// ─── Mutation Hooks ───────────────────────────────────────────────────────────
export { useCatalogMutations } from "./hooks/useCatalogMutations";
export { useCropMutations } from "./hooks/useCropMutations";
export { useCropVarietyMutations } from "./hooks/useCropVarietyMutations";
export { useGrowthCycleTemplateMutations } from "./hooks/useGrowthCycleTemplateMutations";
export { useFarmingMethodCropMutations } from "./hooks/useFarmingMethodCropMutations";
export { useLifecycleTemplateMutations } from "./hooks/useLifecycleTemplateMutations";

// ─── Constants ────────────────────────────────────────────────────────────────
export * from "@/shared/constants/foundation.constants";
