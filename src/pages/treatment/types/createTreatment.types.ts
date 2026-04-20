import type {
  TreatmentAuthor,
  TreatmentAttachment,
  TreatmentProcedure,
  Treatment,
} from "./treatment.types";

export interface CreateTreatmentFormData {
  // Identification
  code: string;
  name: string;
  
  // Step 1: General Info
  zone: string;
  intensity: "low" | "medium" | "high";
  soilProblems: string[];
  targetSeverity: Treatment["severity"];
  soilIssue: string;
  startDate: string;
  endDate: string;
  duration: string;
  budgetRange: string;
  
  // Step 2: Scope & Responsibility
  responsibleUnit: string;
  priority: "low" | "medium" | "high";
  cropGroupTags: string[];
  applicableObjects: string[];
  applicableCrops: string[];
  terrainTypes: string[];
  authors: TreatmentAuthor[];
  
  // Step 3: Methods
  primaryMethodId?: string;
  supportingMethodIds: string[];
  goalTags: string[];
  currentSurvey: string;
  importantNotes: string;
  expectedOutcomeSummary: string;
  
  // Step 4: Procedures & Day-by-Day
  procedures: TreatmentProcedure[];
  attachments: TreatmentAttachment[];
  inspectionParameters: string[];
  qualityChecklist: string[];
  
  // Old fields for backward compatibility/legacy components if needed
  id: string; // Legacy UUID or numeric ID
  crop?: string;
  growthStage?: string;
  diseaseType?: string;
  description?: string;
  illustration?: File | null;
}
