import type { GrowthCycle } from "@/pages/growth-cycle/types/types";

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
  seasonType?: "plant" | "animal";
  scope: "crop" | "variety";
  cropId?: string;
  varietyId?: string;

  // Link to Reference Growth Cycles (Blueprints)
  // A season might use multiple cycles (e.g. distinct stages or multiple crops in one season?)
  // Usually a season applies to a specific crop/variety, so it follows ONE growth cycle pattern,
  // but the user said "one or more". Maybe for intercropping or sequential cycles?
  growthCycleIds: string[];
  growthCycles?: GrowthCycle[]; // Populated data
  selectedStages?: Record<string, Record<string, string | number>>; // cycleId -> stageId -> duration

  documents: SeasonDocument[];

  createdAt: number;
  updatedAt: number;
}

export type SeasonStatus = "planning" | "active" | "completed" | "cancelled";

export type SeasonScope = "crop" | "variety";

export interface CreateSeasonForm {
  code: string;
  name: string;
  description: string;
  duration: number;
  status: SeasonStatus;
  seasonType?: "plant" | "animal";
  scope: SeasonScope;
  cropId?: string;
  varietyId?: string;
  growthCycleIds: string[];
  selectedStages: Record<string, Record<string, string | number>>;
  documents: File[];
}

export interface SeasonFormData extends Omit<CreateSeasonForm, "documents"> {
  documents: (File | SeasonDocument)[];
}
