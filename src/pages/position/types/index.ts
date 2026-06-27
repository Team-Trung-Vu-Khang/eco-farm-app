import type {
  MasterDataRecord,
  PositionResponsibilityDocument,
} from "@/features/master-data";
import type { PositionFormValues } from "../data/position-form.schema";

export interface PositionMetadata {
  source?: string;
}

export interface PositionGroup {
  id: number;
  code: string;
  name: string;
}

export type PositionRecord = MasterDataRecord<"positions"> & {
  positionGroupId?: number | null;
  positionGroup?: PositionGroup | null;
  responsibilityDescription?: string | null;
  metadataJson?: PositionMetadata | null;
};

export type PositionItem = MasterDataRecord<"positions"> & {
  positionGroupId?: number | null;
  positionGroup: PositionGroup | null;
  responsibilityDescription: string;
  documents: PositionResponsibilityDocument[];
  metadataJson?: PositionMetadata | null;
};

export type PositionFormData = PositionFormValues;
