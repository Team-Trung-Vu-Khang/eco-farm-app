import type { FarmPositionResponse } from "@/features/master-data";
import type { PositionFormValues } from "../data/position-form.schema";

export interface PositionMetadata {
  source?: string;
}

export interface PositionGroup {
  id: number;
  code: string;
  name: string;
}

export type PositionRecord = FarmPositionResponse & {
  positionGroupId?: number | null;
  positionGroup?: PositionGroup | null;
  responsibilityDescription?: string | null;
  metadataJson?: PositionMetadata | null;
  documents?: any[];
};

export type PositionItem = FarmPositionResponse & {
  positionGroupId?: number | null;
  positionGroup: PositionGroup | null;
  responsibilityDescription: string;
  documents: any[];
  metadataJson?: PositionMetadata | null;
};

export type PositionFormData = PositionFormValues;
