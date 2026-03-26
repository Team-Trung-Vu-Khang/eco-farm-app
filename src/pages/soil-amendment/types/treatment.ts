export interface TreatmentPlan {
  id: number;
  code: string;
  name: string;
  zone: string;
  objectives: string[];
  duration: string;
  startDate: string;
  endDate: string;
  intensity: "light" | "medium" | "deep";
  priority: "low" | "medium" | "high" | "urgent";
  selectedMethods: number[];
  procedures: TreatmentProcedure[];
  seasonalPhases: SeasonalPhase[];
  status: "planning" | "in_progress" | "completed" | "cancelled";
  area: number;
  budget: number;
  technician: string;
  soilIssue: string;
  cropType: string;
  coverImage?: string;
  soilAnalysis?: SoilAnalysis;
  expectedResults?: ExpectedResult[];
  riskFactors?: string[];
  successIndicators?: string[];
  relatedDocuments?: DocumentAsset[];
  videoTutorials?: VideoTutorial[];
}

export interface SoilAnalysis {
  pH: { current: number; target: number };
  organicMatter: { current: number; target: number; unit: string };
  nitrogen: { current: number; target: number; unit: string };
  phosphorus: { current: number; target: number; unit: string };
  potassium: { current: number; target: number; unit: string };
  ec: { current: number; target: number; unit: string };
  texture: string;
  color: string;
  drainage: "poor" | "moderate" | "good";
}

export interface ExpectedResult {
  metric: string;
  before: string;
  after: string;
  timeframe: string;
}

export interface DocumentAsset {
  id: number;
  name: string;
  type: "pdf" | "doc" | "image";
  url: string;
  size: string;
}

export interface VideoTutorial {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
  url: string;
  description: string;
}

export interface TreatmentMethod {
  id: number;
  name: string;
  type: "physical" | "chemical" | "biological" | "integrated";
  description: string;
  icon: string;
  benefits: string[];
  limitations: string[];
  costEffectiveness: "low" | "medium" | "high";
  difficulty: "easy" | "moderate" | "difficult";
}

export interface TreatmentProcedure {
  id: number;
  stepNumber: number;
  name: string;
  description: string;
  detailedInstructions?: string;
  dosage?: string;
  timing: string;
  technique: string;
  materials: string[];
  equipment: string[];
  estimatedDays: number;
  images?: string[];
  videoUrl?: string;
  warnings?: string[];
  tips?: string[];
  expectedOutcome?: string;
  qualityCheckpoints?: string[];
  weatherRequirements?: string;
  laborRequired?: number;
  estimatedCost?: number;
}

export interface SeasonalPhase {
  id: number;
  phaseName: string;
  seasonType: "pre_season" | "in_season" | "post_season" | "off_season";
  startDate: string;
  endDate: string;
  activities: string[];
  notes: string;
  weatherConditions?: string;
  criticalTasks?: string[];
}

export type TreatmentPlanFormData = Partial<TreatmentPlan>;
