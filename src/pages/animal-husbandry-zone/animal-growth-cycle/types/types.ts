export interface GrowthStage {
  id: string;
  name: string;
  duration: string | number;
  usePdf: boolean;
  pdfFile?: File | null | { name: string; size?: number; url?: string };
  content?: string;
  [key: string]: any;
}

export interface AnimalGrowthCycle {
  id: string;
  name: string;
  cycleType?: "animal" | "animal";
  scope: "group" | "crop" | "variety";
  groupName?: string;
  cropId?: string;
  cropName?: string;
  variety?: string; // Optional if scope is 'crop'
  totalDays: number;
  numStages: number;
  stages: GrowthStage[];
  createdAt: number;
  updatedAt: number;
  isFoundation?: boolean;
  [key: string]: any;
}

export interface CreateAnimalGrowthCycleForm {
  cycleType?: "animal" | "animal";
  scope: "crop" | "variety";
  cropId: string;
  variety?: string;
  totalDays: number;
  stages: GrowthStage[];
}
