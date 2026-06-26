import type { MasterDataRecord } from "@/features/master-data";
import type { PositionFormValues } from "../data/position-form.schema";

export interface PositionMetadata {
  group?: string;
  responsibilities?: string[];
  source?: string;
}

export type PositionItem = MasterDataRecord<"positions"> & {
  group: string;
  responsibilities: string[];
  metadataJson?: PositionMetadata | null;
};

export type PositionFormData = PositionFormValues;
