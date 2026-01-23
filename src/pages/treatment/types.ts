export interface Expert {
  name: string;
  title: string;
  avatar: string;
}

export interface Medicine {
  id: string;
  name: string;
  type: string;
  dosage: string;
  unit: string;
}

export interface TreatmentStep {
  id: string;
  day: number;
  title: string;
  description: string;
  medicineId?: string;
}

export interface TreatmentProtocol {
  id: string;
  name: string;
  code: string;
  crop: string;
  location: string;
  diseaseName: string;
  diseaseScientificName: string;
  diseaseType: string;
  symptoms: string[];
  condition: string;
  status: "active" | "inactive";
  severity: "LOW" | "TRUNG-BINH" | "CAO";
  duration: number; // days
  costPerHa: string; // e.g. "650.000 đ/ha"
  expert: Expert;
  medicines: Medicine[];
  steps: TreatmentStep[];
  safetyNotes: string[];
  image?: string;
}
