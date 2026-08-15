export type SupplyType = "medicine" | "fertilizer" | "material" | "equipment";
export type DomainCode = "CROP" | "LIVESTOCK" | "AQUACULTURE";
export type LegalStatus = "allowed" | "restricted" | "banned";
export type MasterDataStatus = "active" | "inactive" | "archived";

export interface CatalogRef {
  id: number;
  code: string;
  name: string;
}

export interface PackagingVariantRequest {
  packagingTypeId: number;
  unitBaseId: number;
  quantity: number;
  displayOrder?: number;
}

export interface PackagingVariantResponse {
  packagingType: CatalogRef;
  unitBase: CatalogRef;
  quantity: number;
  displayOrder: number;
}

export interface CertificateRequest {
  certificateId: number;
  displayOrder?: number;
}

export interface CertificateResponse {
  certificate: CatalogRef;
  displayOrder: number;
}

export interface ClassificationLinkRequest {
  classification: string;
  groupId: number;
  displayOrder?: number;
}

export interface ClassificationLinkResponse {
  classification: string;
  groupId: number | null;
  group: CatalogRef | null;
  displayOrder: number;
}

export interface ProfileDocumentRequest {
  id?: number;
  documentType: string;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  displayOrder?: number;
}

export interface ProfileDocumentResponse {
  id: number;
  documentType: string;
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  displayOrder: number;
}

// ─── Profiles ────────────────────────────────────────────────────────────────

export interface MedicineProfile {
  concentration?: string;
  activeIngredient?: string;
  moaGroupCode?: string;
  mainUsage?: string;
  recommendedDosage?: string;
  usageMethod?: string;
  usageNotes?: string;
  withdrawalPeriodDays?: number;
  maxUsageCount?: number;
  shelfLife?: string;
  toxicityDescription?: string;
  protectiveMeasures?: string;
  poisoningTreatment?: string;
}

export interface FertilizerProfile {
  documents?: ProfileDocumentRequest[];
  scientificName?: string;
  moaOrNutrientNote?: string;
  npkRatio?: string;
  detailedComposition?: string;
  mainUsage?: string;
  recommendedDosage?: string;
  usageMethod?: string;
  usageNotes?: string;
  toxicityDescription?: string;
  protectiveMeasures?: string;
  poisoningTreatment?: string;
}

export interface EquipmentProfile {
  documents?: ProfileDocumentRequest[];
  model?: string;
  brand?: string;
  countryOfOrigin?: string;
  manufactureYear?: number;
  powerRating?: string;
  capacity?: string;
  fuelType?: string;
  dimensions?: string;
  weight?: string;
  otherSpecs?: string;
  fuelConsumptionRate?: string;
  maintenanceSchedule?: string;
  includedParts?: string;
  typeTags?: string[];
  packagingNotes?: string[];
}

export interface SupplyItemRequest {
  name: string;
  description?: string;
  displayOrder?: number;
  status: MasterDataStatus;
  metadataJson?: Record<string, any>;
  domainCode: DomainCode;
  sku: string;
  manufacturer?: string;
  importer?: string;
  distributor?: string;
  referencePrice?: string;
  registrationNumber?: string;
  legalStatus?: LegalStatus;
  legalDescription?: string;
  hashtags?: string[];
  packagingVariants?: PackagingVariantRequest[];
  certificates?: CertificateRequest[];
  classifications?: ClassificationLinkRequest[];
  targetSubjectIds?: number[];

  // Profiles
  concentration?: string;
  activeIngredient?: string;
  moaGroupCode?: string;
  mainUsage?: string;
  recommendedDosage?: string;
  usageMethod?: string;
  usageNotes?: string;
  withdrawalPeriodDays?: number;
  maxUsageCount?: number;
  shelfLife?: string;
  toxicityDescription?: string;
  protectiveMeasures?: string;
  poisoningTreatment?: string;

  scientificName?: string;
  moaOrNutrientNote?: string;
  npkRatio?: string;
  detailedComposition?: string;

  model?: string;
  brand?: string;
  countryOfOrigin?: string;
  manufactureYear?: number;
  powerRating?: string;
  capacity?: string;
  fuelType?: string;
  dimensions?: string;
  weight?: string;
  otherSpecs?: string;
  fuelConsumptionRate?: string;
  maintenanceSchedule?: string;
  includedParts?: string;
  typeTags?: string[];
  packagingNotes?: string[];
  documents?: ProfileDocumentRequest[];
}

export interface SupplyItemResponse {
  id: number;
  supplyType: SupplyType;
  domainCode: DomainCode;
  code: string;
  sku: string;
  name: string;
  description: string;
  manufacturer: string;
  importer: string;
  distributor: string;
  referencePrice: string;
  registrationNumber: string;
  legalStatus: LegalStatus;
  legalDescription: string;
  displayOrder: number;
  status: MasterDataStatus;
  metadataJson: Record<string, any>;
  hashtags: string[];
  packagingVariants: PackagingVariantResponse[];
  certificates: CertificateResponse[];
  classifications: ClassificationLinkResponse[];
  targetSubjects: CatalogRef[];
  createdAt: string;
  updatedAt: string;

  source: "MASTER" | "OWNER";
  workspaceId: number | null;

  profile?: {
    concentration?: string;
    activeIngredient?: string;
    moaGroupCode?: string;
    mainUsage?: string;
    recommendedDosage?: string;
    usageMethod?: string;
    usageNotes?: string;
    withdrawalPeriodDays?: number;
    maxUsageCount?: number;
    shelfLife?: string;
    toxicityDescription?: string;
    protectiveMeasures?: string;
    poisoningTreatment?: string;

    scientificName?: string;
    moaOrNutrientNote?: string;
    npkRatio?: string;
    detailedComposition?: string;
    documents?: ProfileDocumentResponse[];

    model?: string;
    brand?: string;
    countryOfOrigin?: string;
    manufactureYear?: number;
    powerRating?: string;
    capacity?: string;
    fuelType?: string;
    dimensions?: string;
    weight?: string;
    otherSpecs?: string;
    fuelConsumptionRate?: string;
    maintenanceSchedule?: string;
    includedParts?: string;
    typeTags?: string[];
    packagingNotes?: string[];
  };
}

export interface SupplyQueryParams {
  domainCode?: DomainCode;
  keyword?: string;
  status?: MasterDataStatus;
  page?: number;
  size?: number;
  onlyOwner?: boolean;
}
