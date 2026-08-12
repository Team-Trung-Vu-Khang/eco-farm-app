import type { Pesticide, PesticideFormData } from "../types";

export const createEmptyPesticideFormData = (): PesticideFormData => ({
  // Bước 1
  code: "",
  name: "",
  registrationNumber: "",
  activeIngredient: "",
  concentration: "",
  form: "",
  group: "",
  toxicityLevel: "",
  moaGroup: "",
  actionType: "",
  imageUrl: undefined,
  // Bước 2
  indications: "",
  targetEntities: [],
  recommendedDosage: "",
  applicationMethod: "",
  phi: "",
  maxUsage: "",
  shelfLife: "",
  usageNotes: "",
  // Bước 3
  toxicityInfo: "",
  protectiveMeasures: "",
  firstAid: "",
  legalStatus: "",
  standardsCompliance: [],
  // Bước 4
  manufacturerOrigin: "",
  importerRegistrant: "",
  distributor: "",
  referencePrice: "",
  packagingSpecs: [],
  // Legacy / misc
  origin: "",
  usage: "",
  note: "",
  hashtags: [],
  technicalDocType: "file",
  technicalDocContent: "",
  technicalDocFile: null,
  selectedSupplierId: "",
  quantity: "",
  unit: "",
  packaging: "",
});

export const createPesticideFormDataFromItem = (
  item: Pesticide,
): PesticideFormData => ({
  // Bước 1
  code: item.code,
  name: item.name,
  registrationNumber: item.registrationNumber ?? "",
  activeIngredient: item.activeIngredient,
  concentration: item.concentration ?? "",
  form: item.form,
  group: item.group,
  toxicityLevel: item.toxicityLevel ?? "",
  moaGroup: item.moaGroup ?? "",
  actionType: item.actionType,
  imageUrl: item.imageUrl,
  // Bước 2
  indications: item.indications ?? "",
  targetEntities: item.targetEntities ?? [],
  recommendedDosage: item.recommendedDosage ?? "",
  applicationMethod: item.applicationMethod ?? "",
  phi: item.phi != null ? String(item.phi) : "",
  maxUsage: item.maxUsage != null ? String(item.maxUsage) : "",
  shelfLife: item.shelfLife ?? "",
  usageNotes: item.usageNotes ?? "",
  // Bước 3
  toxicityInfo: item.toxicityInfo ?? "",
  protectiveMeasures: item.protectiveMeasures ?? "",
  firstAid: item.firstAid ?? "",
  legalStatus: item.legalStatus ?? "",
  standardsCompliance: item.standardsCompliance ?? [],
  // Bước 4
  manufacturerOrigin: item.manufacturerOrigin ?? item.origin ?? "",
  importerRegistrant: item.importerRegistrant ?? "",
  distributor: item.distributor ?? "",
  referencePrice: item.referencePrice ?? "",
  packagingSpecs: item.packagingSpecs ?? [],
  // Legacy / misc
  origin: item.origin,
  usage: "",
  note: "",
  hashtags: ["HieuQuaCao", "AnToan"],
  technicalDocType: "file",
  technicalDocContent: "",
  technicalDocFile: null,
  selectedSupplierId: "sup1",
  ...parsePackagingSpec(item.packagingSpecs?.[0]),
});

export const parsePackagingSpec = (spec?: string) => {
  if (!spec) return { quantity: "", unit: "", packaging: "" };
  if (spec.includes(" / ")) {
    const parts = spec.split(" / ");
    const left = parts[0].trim();
    const packaging = parts[1].trim();
    const spaceIdx = left.indexOf(" ");
    if (spaceIdx !== -1) {
      const quantity = left.substring(0, spaceIdx).trim();
      const unit = left.substring(spaceIdx + 1).trim();
      return { quantity, unit, packaging };
    }
    return { quantity: left, unit: "", packaging };
  }
  const numMatch = spec.match(/\d+/);
  if (numMatch) {
    const quantity = numMatch[0];
    const idx = spec.indexOf(quantity);
    const packaging = spec.substring(0, idx).trim();
    const unit = spec.substring(idx + quantity.length).trim();
    return { quantity, unit, packaging };
  }
  return { quantity: "", unit: "", packaging: spec };
};
