import type { GrowthCycle } from "../growth-cycle/types/types";

export interface SeasonDocument {
  id: string;
  name: string;
  url: string;
  type: "technical" | "regulatory" | "other";
  uploadedAt: string;
}

export interface Season {
  id: string;
  code: string;
  name: string;
  description: string;
  duration: number;
  status: "planning" | "active" | "completed" | "cancelled";
  scope: "crop" | "variety";
  cropId?: string;
  varietyId?: string;

  // Link to Reference Growth Cycles (Blueprints)
  // A season might use multiple cycles (e.g. distinct stages or multiple crops in one season?)
  // Usually a season applies to a specific crop/variety, so it follows ONE growth cycle pattern,
  // but the user said "one or more". Maybe for intercropping or sequential cycles?
  growthCycleIds: string[];
  growthCycles?: GrowthCycle[]; // Populated data
  selectedStages?: Record<string, Record<string, number>>; // cycleId -> stageId -> duration

  documents: SeasonDocument[];

  createdAt: number;
  updatedAt: number;
}

export interface CreateSeasonForm {
  code: string;
  name: string;
  description: string;
  duration: number;
  status: "planning" | "active" | "completed" | "cancelled";
  scope: "crop" | "variety";
  cropId?: string;
  varietyId?: string;
  growthCycleIds: string[];
  selectedStages: Record<string, Record<string, number>>;
  documents: File[];
}
