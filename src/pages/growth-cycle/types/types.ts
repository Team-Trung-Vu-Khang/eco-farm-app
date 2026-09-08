export interface GrowthStage {
  id: string;
  name: string;
  duration: string | number;
  usePdf: boolean;
  pdfFile?: File | null | { name: string; size: number; url?: string };
  content: string;
}

export interface GrowthCycle {
  id: string;
  name: string;
  cycleType?: "plant" | "animal" | "aquaculture";
  scope: "group" | "crop" | "variety" | "livestock" | "aquaculture";
  scopeNames?: string[];
  cropId: string;
  cropName: string;
  variety?: string; // Optional if scope is 'crop'
  totalDays: number;
  numStages: number;
  stages: GrowthStage[];
  createdAt: number;
  updatedAt: number;
  isFoundation?: boolean;
}

export interface CreateGrowthCycleForm {
  cycleType?: "plant";
  scope: "crop" | "variety";
  cropId: string;
  variety?: string;
  totalDays: number;
  stages: GrowthStage[];
}
