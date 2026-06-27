import type { MasterDataStatus } from "@/features/master-data/types/master-data.type";

export interface EnterpriseType {
  id: number;
  code: string;
  name: string;
  description: string;
  status: MasterDataStatus;
  createdAt: string;
}

export type CategoryType = "organization" | "business";

export interface EnterpriseTypeFormData {
  code: string;
  name: string;
  description: string;
  status: MasterDataStatus;
  metadataJson?: Record<string, unknown> | null;
}
