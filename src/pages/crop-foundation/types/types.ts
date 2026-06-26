import type { SerializedEditorState } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export interface SeedInfo {
  supplier: string;
  importDate: string;
  importLink: string;
  contractId: string;
  documents: { name: string; url: string }[];
}

export interface CropFoundationStatus {
  area: string;
  location: string;
  lote: string;
  owner: string; // Doanh nghiệp/Nông hộ
  plantDate: string;
  age: string; // years-months
  status: string; // Hiện trạng sức khỏe
  responsiblePerson: {
    executor: string;
    manager: string;
    inspector: string;
  };
}

export interface FarmingHistoryItem {
  id: string;
  time: string;
  action: string;
  executor: string;
  manager: string;
  inspector: string;
}

export interface DiseaseHistoryItem {
  id: string;
  startTime: string;
  diseaseName: string;
  note: string;
  treatmentTime: string;
  treatmentProcess: {
    milestone: string;
    date: string;
    description: string;
  }[];
  materialsUsed: {
    name: string;
    quantity: string;
    unit: string;
  }[];
}

export interface HarvestHistoryItem {
  id: string;
  time: string;
  yield: string;
  harvester: string;
}

export interface IoTMetric {
  label: string;
  value: string;
  unit: string;
  trend?: "up" | "down" | "stable";
}

export interface IoTData {
  current: IoTMetric[];
  history3Days: IoTMetric[];
  history1Week: IoTMetric[];
  history1Month: IoTMetric[];
}

export interface CropFoundation {
  id: number;
  code: string;
  illustration: string | null;
  name: string;
  cropFoundationType: string;
  cropFoundationGroup: string;
  harvestMethod: string;
  // Detailed info
  seedInfo?: SeedInfo;
  statusInfo?: CropFoundationStatus;
  farmingHistory?: FarmingHistoryItem[];
  diseaseHistory?: DiseaseHistoryItem[];
  harvestHistory?: HarvestHistoryItem[];
  iotData?: IoTData;
  technicalSpecs?: TechnicalSpecs;
}

export interface CropFoundationFilter {
  cropFoundationTypes: string[];
  harvestMethods: string[];
  growthCycles: string[];
}

export interface GrowthCycleDetail {
  id: string;
  name: string;
  stages: string[];
  estimatedDays: string;
}

export interface DocumentSection {
  type: "editor" | "pdf";
  content: SerializedEditorState;
  file: File | null;
}

// ... existing code ...
export interface TechnicalSpecs {
  scientificName: string;
  family: string;
  origin: string;
  tempRange: string;
  humidityRange: string;
  phRange: string;
  plantingDensity: string;
  watering: string;
}

export interface CreateCropFoundationForm {
  code: string;
  name: string;
  cropGroupId: string;
  cropFoundationType: string;
  variety: string;
  illustration: File | string | null;
  description: string;
  selectedSeedIds: string[];
  harvestMethod: string;
  technicalSpecs: TechnicalSpecs;
  growthCycles: GrowthCycleDetail[];
  docs: {
    farmingTechnique: DocumentSection;
    qualityStandard: DocumentSection;
  };
}

