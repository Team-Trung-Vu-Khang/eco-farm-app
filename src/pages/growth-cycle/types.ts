import type { SerializedEditorState } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export interface GrowthStage {
  id: string;
  name: string;
  duration: number;
  usePdf: boolean;
  pdfFile?: File | null | { name: string; size: number };
  content: SerializedEditorState;
}

export interface GrowthCycle {
  id: string;
  name: string;
  scope: "crop" | "variety";
  cropId: string;
  cropName: string;
  variety?: string; // Optional if scope is 'crop'
  totalDays: number;
  numStages: number;
  stages: GrowthStage[];
  createdAt: number;
  updatedAt: number;
}

export interface CreateGrowthCycleForm {
  scope: "crop" | "variety";
  cropId: string;
  variety?: string;
  totalDays: number;
  stages: GrowthStage[];
}
