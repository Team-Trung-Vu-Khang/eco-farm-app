export interface SupplierDetail {
  supplierId: string;
  quantity: string;
  unit: string;
  packaging: string;
}

export interface Fertilizer {
  id: number;
  code: string;
  name: string;
  imageUrl?: string;

  // Existing properties (to avoid breaking current UI/store dependencies)
  nutritionalContentId: string;
  originId: string;
  applicationStageId: string;
  physicalFormId: string;
  nutrientContent: string;
  description: string;

  // New fields from desc-fertilizer-feature-for-crop-domain.json
  registrationNumber?: string;
  scientificTechnicalName?: string;
  fertilizerOriginGroup?: string;
  nutritionalComponents?: string;
  fertilizerType?: string;
  physicalForm?: string;
  mainIngredients?: string;
  moaGroup?: string;
  npkRatio?: string;

  // Step 2 - Usage
  indications?: string;
  applicationStage?: string;
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

export interface FertilizerFormData {
  code: string;
  name: string;
  imageUrl?: string;
  imageFile?: File | null;

  // Existing properties
  nutritionalContentId: string;
  originId: string;
  applicationStageId: string;
  physicalFormId: string;
  nutrientContent: string;
  description: string;

  // New fields
  registrationNumber: string;
  scientificTechnicalName: string;
  fertilizerOriginGroup: string;
  nutritionalComponents: string;
  fertilizerType: string;
  physicalForm: string;
  mainIngredients: string;
  moaGroup: string;
  npkRatio: string;

  // Step 2
  indications: string;
  applicationStage: string;
  targetCrops: string[];
  recommendedDosage: string;
  applicationMethod: string;
  usageNotes: string;
  shelfLife: string;

  // Step 3
  toxicityInfo: string;
  protectiveMeasures: string;
  firstAid: any; // SerializedEditorState or HTML string
  legalStatus: "allowed" | "restricted" | "banned";
  legalDescription: string;
  standardsCompliance: string[];

  // Step 4
  manufacturerOrigin: string;
  importerRegistrant: string;
  distributor: string;
  referencePrice: string;
  packagingSpecs: string[];

  hashtags: string[];
  documents: { name: string; size: number; file?: File }[];

  quantity?: string;
  unit?: string;
  packaging?: string;
  formType?: "basic" | "advanced";
}
