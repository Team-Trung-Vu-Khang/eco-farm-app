import type { OrganizationOption } from "@/components/organizations/PartnerSelectorDialog";

export interface SupplierDetail {
  supplierId: string;
  quantity: string;
  unit: string;
  packaging: string;
}

export interface ByProduct {
  id: number;
  code: string;
  name: string;
  imageUrl?: string;

  nutritionalContentId: string;
  originId: string;
  applicationStageId: string;
  physicalFormId: string;
  nutrientContent: string;
  description: string;

  registrationNumber?: string;
  scientificTechnicalName?: string;
  byProductOriginGroup?: string;
  detailedComposition?: string;

  // Step 2 - Usage
  indications?: string;
  applicationStage?: string;
  effectStage?: string;
  targetCrops?: string[];
  recommendedDosage?: string;
  applicationMethod?: string;
  usageNotes?: string;
  shelfLife?: string;

  // Step 3 - Safety & Legal
  toxicityInfo?: string;
  protectiveMeasures?: string;
  firstAid?: string;
  legalStatus?: string;
  standardsCompliance?: string[];

  // Step 4 - Supply
  manufacturerOrigin?: string;
  importerRegistrant?: string;
  distributor?: string;
  referencePrice?: string;
  packagingSpecs?: string[];

  status: "active" | "inactive";
  createdAt: string;
}

export interface ByProductFormData {
  configMode?: "SPEC" | "BASE_UNIT";

  code: string;
  name: string;
  imageUrl?: string;
  imageFile?: File | null;

  registrationNumber: string;
  scientificTechnicalName: string;

  // 3 tab classifications for By-Product
  byProductOrigins?: string[];
  byProductPhysicoChemicals?: string[];
  byProductToxicityRegulations?: string[];

  detailedComposition: string;
  description: string;

  // Usage & Dosage
  indications: string;
  applicationStage: string;
  effectStage: string;
  targetCrops: string[];
  recommendedDosage: string;
  applicationMethod: string;
  usageNotes: string;
  shelfLife: string;

  // Safety & Legal
  toxicityInfo: string;
  protectiveMeasures: string;
  firstAid: any;
  legalStatus: "allowed" | "restricted" | "banned";
  legalDescription: string;
  standardsCompliance: string[];

  // Supply & Packaging
  manufacturerOrigin: OrganizationOption | null;
  importerRegistrant: OrganizationOption | null;
  distributor: OrganizationOption | null;
  referencePrice: string;
  packagingSpecs: string[];

  hashtags: string[];
  documents: { name: string; size: number; file?: File }[];

  quantity?: string;
  unit?: string;
  packaging?: string;
  formType?: "basic" | "advanced";
}
