import type { OrganizationOption } from "@/components/organizations/PartnerSelectorDialog";
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
  technologyLevelIds: [],
  valueChainIds: [],

  // Origin & Supply fields
  manufacturerOrigin: null,
  importerRegistrant: null,
  distributor: null,
  packagingSpecs: [],
});

const normalizeOrganizationOption = (
  org?: OrganizationOption | string | null,
): OrganizationOption | null => {
  if (!org) return null;
  if (typeof org === "object" && org !== null && "id" in org) {
    return org as OrganizationOption;
  }
  return null;
};

export const createMaterialFormDataFromItem = (
  item: Material,
): MaterialFormData => {
  const techIds =
    Array.isArray(item.technologyLevelIds) && item.technologyLevelIds.length > 0
      ? item.technologyLevelIds
      : item.technologyLevelId
        ? [item.technologyLevelId]
        : [];

  const chainIds =
    Array.isArray(item.valueChainIds) && item.valueChainIds.length > 0
      ? item.valueChainIds
      : item.valueChainId
        ? [item.valueChainId]
        : [];

  return {
    code: item.code ?? "",
    name: item.name ?? "",
    type: item.type ?? "",
    description: item.description ?? "",
    hashtags: Array.isArray(item.hashtags) ? item.hashtags : [],
    imageUrl: item.imageUrl ?? "",
    imageFile: null,
    materialGroupId: item.materialGroupId ?? "",
    technologyLevelId: item.technologyLevelId ?? (techIds[0] || ""),
    valueChainId: item.valueChainId ?? (chainIds[0] || ""),
    technologyLevelIds: techIds,
    valueChainIds: chainIds,

    // Hydrate origin & supply fields
    manufacturerOrigin: normalizeOrganizationOption(item.manufacturerOrigin),
    importerRegistrant: normalizeOrganizationOption(item.importerRegistrant),
    distributor: normalizeOrganizationOption(item.distributor),
    packagingSpecs: Array.isArray(item.packagingSpecs)
      ? item.packagingSpecs
      : [],
  };
};
