import { useQuery } from "@tanstack/react-query";
import { farmSupplyApi } from "../api/farm-supply.api";
import type { SupplyType } from "../types";
import { formatPackagingSpecs } from "../utils/packaging.mapper";

export function useFarmSupplyDetailHook(type: SupplyType, id: number) {
  const searchParams = new URLSearchParams(window.location.search);
  const source = (searchParams.get("source") as "MASTER" | "OWNER") ?? "OWNER";

  const query = useQuery({
    queryKey: ["farm-supplies", "detail", type, id, source],
    queryFn: () =>
      farmSupplyApi.getById(type, id, source).then((item) => {
        if (!item) return null;
        if (type === "medicine") {
          return mapMedicineDetail(item);
        } else if (type === "fertilizer") {
          return mapFertilizerDetail(item);
        } else if (type === "equipment") {
          return mapEquipmentDetail(item);
        } else if (type === "material") {
          return mapMaterialDetail(item);
        }
        return item;
      }),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    item: query.data ?? null,
    loading: query.isLoading,
    error: query.error?.message ?? null,
  };
}

function formatVND(value: string | number | null | undefined): string {
  if (!value) return "Chưa cập nhật";
  const strVal = value.toString().trim();
  if (
    strVal.toLowerCase().includes("đ") ||
    strVal.toLowerCase().includes("vnd")
  ) {
    return strVal;
  }
  let s = strVal.replace(/\s+/g, "").replace(/\./g, "").replace(/,/g, ".");
  const matched = s.match(/[-+]?[0-9]*\.?[0-9]+/);
  if (!matched) return strVal;
  const num = parseFloat(matched[0]);
  if (isNaN(num)) return strVal;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
}

function formatLegalStatus(status: string | null | undefined): string {
  if (!status) return "Được phép sử dụng";
  const normalized = status.toLowerCase().trim();
  if (normalized === "allowed") return "Được phép sử dụng";
  if (normalized === "restricted") return "Hạn chế sử dụng";
  if (normalized === "banned") return "Cấm sử dụng";
  return status;
}

function mapMedicineDetail(item: any) {
  if (!item) return null;
  const profile = item.profile || {};
  return {
    ...item,
    code: item.sku || item.code,
    activeIngredient: profile.activeIngredient || "",
    concentration: profile.concentration || "",
    group:
      item.classifications?.find(
        (c: any) =>
          c.classification === "target_group" || c.classification === "usage",
      )?.group?.name || "",
    form:
      item.classifications?.find((c: any) => c.classification === "dosage_form")
        ?.group?.name || "",
    toxicityLevel:
      item.classifications?.find(
        (c: any) =>
          c.classification === "toxicity" ||
          c.classification === "control_level" ||
          c.classification === "control_residue_level",
      )?.group?.name ||
      (item.metadataJson && item.metadataJson?.toxicityLevel) ||
      "",
    moaGroup: profile.moaGroupCode || profile.moaOrNutrientNote || "",
    actionType:
      item.classifications?.find(
        (c: any) =>
          c.classification === "mode_of_action" ||
          c.classification === "usage_method",
      )?.group?.name || "",
    origin:
      item.classifications?.find(
        (c: any) =>
          c.classification === "origin" ||
          c.classification === "target_subject",
      )?.group?.name ||
      (item.metadataJson && item.metadataJson?.origin) ||
      "",
    imageUrl:
      item.imageUrl || (item.metadataJson && item.metadataJson?.imageUrl) || "",

    indications: profile.mainUsage || "",
    targetEntities: item.targetSubjects?.map((t: any) => t.name) || [],
    recommendedDosage: profile.recommendedDosage || "",
    applicationMethod: profile.usageMethod || "",
    phi: profile.withdrawalPeriodDays
      ? String(profile.withdrawalPeriodDays)
      : "",
    maxUsage: profile.maxUsageCount ? String(profile.maxUsageCount) : "",
    shelfLife: profile.shelfLife || "",
    usageNotes: profile.usageNotes || "",

    toxicityInfo: profile.toxicityDescription || "",
    protectiveMeasures: profile.protectiveMeasures || "",
    firstAid: profile.poisoningTreatment || "",
    legalStatus: formatLegalStatus(item.legalStatus),
    legalDescription: item.legalDescription || "",
    standardsCompliance:
      item.certificates?.map((c: any) => c.certificate?.name).filter(Boolean) ||
      [],

    manufacturerOrigin:
      item.manufacturerOrganization?.name || item.manufacturer || "",
    importerRegistrant: item.importerOrganization?.name || item.importer || "",
    distributor: item.distributorOrganization?.name || item.distributor || "",
    referencePrice: formatVND(item.referencePrice),
    packagingSpecs: formatPackagingSpecs(item.packagingVariants) || [],
    hashtags: (item.hashtags || []).map((t: any) =>
      typeof t === "string"
        ? t.startsWith("#")
          ? t.slice(1)
          : t
        : String(t || ""),
    ),
    note: item.description || "",
  };
}

function mapFertilizerDetail(item: any) {
  if (!item) return null;
  const profile = item.profile || {};
  return {
    ...item,
    code: item.sku || item.code,
    imageUrl:
      item.imageUrl || (item.metadataJson && item.metadataJson?.imageUrl) || "",
    imageFile: null,

    nutritionalContentId:
      item.classifications?.find(
        (c: any) => c.classification === "nutrient_composition",
      )?.group?.name || "macronutrients",
    originId:
      item.classifications?.find((c: any) => c.classification === "origin")
        ?.group?.name || "inorganic",
    applicationStageId:
      item.classifications?.find(
        (c: any) => c.classification === "effect_stage",
      )?.group?.name || "top_dressing",
    physicalFormId:
      item.classifications?.find(
        (c: any) => c.classification === "physical_form",
      )?.group?.name || "soil_application",
    nutrientContent: profile.detailedComposition || "",
    description: item.description || "",

    registrationNumber: item.registrationNumber || "",
    scientificTechnicalName: profile.scientificName || "",
    fertilizerOriginGroup:
      item.classifications?.find((c: any) => c.classification === "origin")
        ?.group?.name || "",
    nutritionalComponents: profile.detailedComposition || "",
    fertilizerType:
      item.classifications?.find(
        (c: any) => c.classification === "nutrient_composition",
      )?.group?.name || "",
    physicalForm:
      item.classifications?.find(
        (c: any) => c.classification === "physical_form",
      )?.group?.name || "",
    mainIngredients: profile.detailedComposition || "",
    moaGroup: profile.moaOrNutrientNote || "",
    npkRatio: profile.npkRatio || "",

    indications: profile.mainUsage || "",
    applicationStage:
      item.classifications?.find(
        (c: any) => c.classification === "effect_stage",
      )?.group?.name || "",
    targetCrops: item.targetSubjects?.map((t: any) => t.name) || [],
    recommendedDosage: profile.recommendedDosage || "",
    applicationMethod: profile.usageMethod || "",
    usageNotes: profile.usageNotes || "",

    toxicityInfo: profile.toxicityDescription || "",
    protectiveMeasures: profile.protectiveMeasures || "",
    firstAid: profile.poisoningTreatment || "",
    legalStatus: formatLegalStatus(item.legalStatus),
    legalDescription: item.legalDescription || "",
    standardsCompliance:
      item.certificates?.map((c: any) => c.certificate?.name).filter(Boolean) ||
      [],

    manufacturerOrigin:
      item.manufacturerOrganization?.name || item.manufacturer || "",
    importerRegistrant: item.importerOrganization?.name || item.importer || "",
    distributor: item.distributorOrganization?.name || item.distributor || "",
    referencePrice: formatVND(item.referencePrice),
    packagingSpecs: formatPackagingSpecs(item.packagingVariants) || [],
    hashtags: (item.hashtags || []).map((t: string) =>
      t.startsWith("#") ? t.slice(1) : t,
    ),
  };
}

function mapEquipmentDetail(item: any) {
  if (!item) return null;
  const profile = item.profile || {};
  const metadata = item.metadataJson
    ? typeof item.metadataJson === "string"
      ? (() => {
          try {
            return JSON.parse(item.metadataJson);
          } catch {
            return {};
          }
        })()
      : item.metadataJson
    : {};
  return {
    ...item,
    code: item.code || "",
    name: item.name || "",
    sku: item.sku || item.code || "",
    machineName: item.name || "",
    model: profile.model || "",
    productImage: item.imageUrl || metadata.imageUrl || "",
    manufacturer:
      profile.brand ||
      item.manufacturerOrganization?.name ||
      item.manufacturer ||
      "",
    countryOfOrigin: profile.countryOfOrigin || "",
    manufactureYear: profile.manufactureYear
      ? String(profile.manufactureYear)
      : "",
    technologyLevelGroup:
      item.classifications?.find(
        (c: any) => c.classification === "technology_level",
      )?.group?.name || "",
    assetManagementGroup:
      item.classifications?.find(
        (c: any) => c.classification === "financial_aspect",
      )?.group?.name || "",
    valueChainGroup:
      item.classifications
        ?.filter((c: any) => c.classification === "value_chain")
        ?.map((c: any) => c.group?.name) || [],
    machineType: profile.typeTags || [],
    powerCapacity: profile.powerRating || "",
    workingCapacity: profile.capacity || "",
    fuelEnergyType: profile.fuelType || "Dầu diesel",
    dimensions: profile.dimensions || "",
    weight: profile.weight || "",
    otherSpecifications: profile.otherSpecs || "",
    fuelConsumptionRate: profile.fuelConsumptionRate || "",
    maintenanceSchedule: profile.maintenanceSchedule || "",
    mainAccessories: profile.includedParts || "",
    manufacturerOrigin: item.manufacturerOrganization
      ? {
          id: Number(item.manufacturerOrganization.id),
          name: item.manufacturerOrganization.name,
        }
      : item.manufacturer
        ? { id: 0, name: item.manufacturer }
        : null,
    importerRegistrant: item.importerOrganization
      ? {
          id: Number(item.importerOrganization.id),
          name: item.importerOrganization.name,
        }
      : item.importer
        ? { id: 0, name: item.importer }
        : null,
    distributor: item.distributorOrganization
      ? {
          id: Number(item.distributorOrganization.id),
          name: item.distributorOrganization.name,
        }
      : item.distributor
        ? { id: 0, name: item.distributor }
        : null,
    referencePrice: formatVND(item.referencePrice),
    packagingSpecs: formatPackagingSpecs(item.packagingVariants) || [],
    hashtags: item.hashtags || [],
    status: item.status || "active",
    description: item.description || "",
  };
}

function mapMaterialDetail(item: any) {
  if (!item) return null;
  return {
    ...item,
    code: item.sku || item.code,
    name: item.name,
    description: item.description || "",
    status: item.status || "active",
    technologyLevelId:
      item.classifications?.find(
        (c: any) => c.classification === "technology_level",
      )?.group?.name || "",
    valueChainId:
      item.classifications?.find((c: any) => c.classification === "value_chain")
        ?.group?.name || "",
    materialGroupId: item.classifications?.[0]?.group?.name || "",
    manufacturerOrigin: item.manufacturerOrganization
      ? {
          id: Number(item.manufacturerOrganization.id),
          name: item.manufacturerOrganization.name,
        }
      : item.manufacturer
        ? { id: 0, name: item.manufacturer }
        : null,
    importerRegistrant: item.importerOrganization
      ? {
          id: Number(item.importerOrganization.id),
          name: item.importerOrganization.name,
        }
      : item.importer
        ? { id: 0, name: item.importer }
        : null,
    distributor: item.distributorOrganization
      ? {
          id: Number(item.distributorOrganization.id),
          name: item.distributorOrganization.name,
        }
      : item.distributor
        ? { id: 0, name: item.distributor }
        : null,
    packagingSpecs: formatPackagingSpecs(item.packagingVariants) || [],
    hashtags: item.hashtags || [],
    referencePrice: formatVND(item.referencePrice),
  };
}
