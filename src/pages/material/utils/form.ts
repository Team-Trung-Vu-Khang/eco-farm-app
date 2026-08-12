import type {
  MaterialFormData,
  Material,
} from "../types/types";

export const createEmptyMaterialFormData = (): MaterialFormData => ({
  code: "",
  name: "",
  type: "",
  description: "",
  hashtags: [],
  materialGroupId: "",
  technologyLevelId: "",
  valueChainId: "",

  // Origin & Supply fields
  manufacturerOrigin: [],
  importerRegistrant: [],
  distributor: [],
  packagingSpecs: [],
});

export const createMaterialFormDataFromItem = (
  item: Material,
): MaterialFormData => ({
  code: item.code,
  name: item.name,
  type: item.type,
  description: item.description,
  hashtags: ["BenBi", "TietKiem"],
  materialGroupId: item.materialGroupId || "",
  technologyLevelId: item.technologyLevelId || "",
  valueChainId: item.valueChainId || "",

  // Hydrate origin & supply fields
  manufacturerOrigin: item.manufacturerOrigin || [],
  importerRegistrant: item.importerRegistrant || [],
  distributor: item.distributor || [],
  packagingSpecs: item.packagingSpecs || [],
});
