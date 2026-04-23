export interface TreatmentAuthor {
  id: number;
  name: string;
  qualification: string;
  organization: string;
}

export interface TreatmentAttachment {
  id: number;
  name: string;
  fileType: "pdf" | "image" | "video";
  size: string;
  url?: string;
}

export interface TreatmentMaterialItem {
  id: number;
  category: string;
  name: string;
  dosageMin: string;
  dosageMax: string;
  unit: string;
}

export interface TreatmentProcedure {
  id: number;
  stepNumber: number;
  name: string;
  description: string;
  startDay?: number;
  endDay?: number;
  detailedInstructions: any;
  dosage: string;
  timing: string;
  technique: string;
  materials: string[];
  equipment: string[];
  stageMaterials: TreatmentMaterialItem[];
  estimatedDays: number;
  warnings: any;
  tips: string[];
  expectedOutcome: any;
  qualityCheckpoints: any;
  attachments: TreatmentAttachment[];
}

export interface Treatment {
  id: number;
  code: string;
  name: string;
  cropType: string;
  crop: string;
  variety: string;
  disease: string;
  severity: "M0" | "M1" | "M2" | "M3" | "M4";
  author: string;
  authorTitle: string;
  approvedBy?: string;
  approvalDate?: string;
  version?: string;
  totalCost: string;
  totalDuration: string;
  safetyRating: "low" | "medium" | "high";
  efficacyRate?: string;
  status: "active" | "inactive";
  createdAt: string;
  seed?: string;
  steps?: any[];
  images?: string[];
  videoUrl?: string;
  stage?: string;
  
  // Dynamic collections from the wizard
  authors?: TreatmentAuthor[];
  attachments?: TreatmentAttachment[];
  procedures?: TreatmentProcedure[];
  
  // Expanded fields
  zone?: string;
  soilIssue?: string;
  soilProblems?: string[];
  startDate?: string;
  endDate?: string;
  duration?: string;
  budgetRange?: string;
  responsibleUnit?: string;
  priority?: "low" | "medium" | "high";
  cropGroupTags?: string[];
  applicableObjects?: string[];
  applicableCrops?: string[];
  terrainTypes?: string[];
  primaryMethodId?: string;
  supportingMethodIds?: string[];
  goalTags?: string[];
  currentSurvey?: string;
  importantNotes?: string;
  expectedOutcomeSummary?: string;
  inspectionParameters?: string[];
  qualityChecklist?: string[];
  applicableCropConfigs?: any[];
}

export interface SearchFilters {
  keyword: string;
  cropType: string;
  crop: string;
  variety: string;
  disease: string;
  severity: string;
  status: string;
}
