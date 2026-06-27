import type {
  MasterDataStatus,
  PlanGroupRecord,
  PlanTypeRecord,
} from "@/features/master-data/types/master-data.type";

export type PlanType = PlanTypeRecord;

export interface PlanTypeFormData {
  code: string;
  name: string;
  description: string;
  color: string;
  displayOrder: number;
  status: MasterDataStatus;
  planGroupId: string;
}

export interface PlanTypeFormOption {
  label: string;
  value: string;
}

export type PlanGroupOption = Pick<PlanGroupRecord, "id" | "name" | "code">;
