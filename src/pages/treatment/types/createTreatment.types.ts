export interface CreateTreatmentStep {
  id: string;
  day: string;
  title: string;
  type: string;
  description: string;
}

export interface CreateTreatmentMaterial {
  id: string;
  name: string;
  dosage: string;
}

export interface CreateTreatmentFormData {
  id: string;
  name: string;
  crop: string;
  growthStage: string;
  diseaseType: string;
  description: string;
  tags: string[];
  illustration: File | null;
  steps: CreateTreatmentStep[];
  materials: CreateTreatmentMaterial[];
  phi: string;
  safetyNotes: string;
  estimatedCost: string;
}
