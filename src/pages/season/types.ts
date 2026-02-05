import type { GrowthCycle } from "../growth-cycle/types";

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
  startDate: string;
  endDate: string; // Estimated or actual
  status: "planning" | "active" | "completed" | "cancelled";

  // Link to Reference Growth Cycles (Blueprints)
  // A season might use multiple cycles (e.g. distinct stages or multiple crops in one season?)
  // Usually a season applies to a specific crop/variety, so it follows ONE growth cycle pattern,
  // but the user said "one or more". Maybe for intercropping or sequential cycles?
  growthCycleIds: string[];
  growthCycles?: GrowthCycle[]; // Populated data

  documents: SeasonDocument[];

  createdAt: number;
  updatedAt: number;
}

export interface CreateSeasonForm {
  code: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "planning" | "active" | "completed" | "cancelled";
  growthCycleIds: string[];
  documents: File[];
}
