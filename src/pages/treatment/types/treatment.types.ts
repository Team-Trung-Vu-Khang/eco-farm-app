export interface TreatmentStep {
  id: number;
  step: number;
  name: string;
  description: string;
  pesticideId: string; // Link to material system
  pesticide: string;
  dosage: string;
  dosagePerArea: string;
  applicationMethod: string;
  timing: string;
  duration: string;
  frequency: string;
  cost: string;
  costPerArea: string;
  safetyPeriod: string;
  ppeRequired: string;
  weatherConditions: string;
  notes: string;
}

export interface Treatment {
  id: number;
  code: string;
  name: string;
  cropType: string;
  crop: string;
  variety: string;
  seed: string;
  disease: string;
  severity: "mild" | "moderate" | "severe";
  author: string;
  authorTitle: string;
  approvedBy: string;
  approvalDate: string;
  version: string;
  totalCost: string;
  totalDuration: string;
  safetyRating: "low" | "medium" | "high";
  efficacyRate: string;
  steps: TreatmentStep[];
  status: "active" | "inactive";
  createdAt: string;
  images?: string[];
  videoUrl?: string;
  stage?: string; // Growth stage e.g. "Ra hoa", "Nuôi quả"
  location?: {
    lat: number;
    lng: number;
    address: string;
    polygon?: { lat: number; lng: number }[];
  };
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

export interface Material {
  id: string;
  code: string;
  name: string;
  type: "pesticide" | "fertilizer" | "material";
  manufacturer: string;
  activeIngredient: string;
  concentration: string;
  formulation: string;
  toxicityLevel: "low" | "medium" | "high";
  safetyPeriod: string;
  instructions: string;
  dosageGuide: string;
  storage: string;
  warnings: string[];
  registrationNumber: string;
  expiryMonths: number;
}
