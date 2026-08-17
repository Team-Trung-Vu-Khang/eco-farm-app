import type { MaterialFormData, Material } from "../types/types";

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
  manufacturerOrigin: null,
  importerRegistrant: null,
  distributor: null,
  packagingSpecs: [],
});

export const createMaterialFormDataFromItem = (
  item: Material,
): MaterialFormData => ({
  code: item.code,
  name: item.name,
  type: item.type || "",
  description: item.description,
  hashtags: item.hashtags || [],
  imageUrl: item.imageUrl || "",
  imageFile: null,
  materialGroupId: item.materialGroupId || "",
  technologyLevelId: item.technologyLevelId || "",
  valueChainId: item.valueChainId || "",

  // Hydrate origin & supply fields
  manufacturerOrigin: item.manufacturerOrigin || null,
  importerRegistrant: item.importerRegistrant || null,
  distributor: item.distributor || null,
  packagingSpecs: item.packagingSpecs || [],
});
