import type { MasterDataStatus } from "@/features/master-data/types/master-data.type";

export type OrganizationUnitType =
  | "enterprise"
  | "farm_household"
  | "cooperative";

export interface EnterpriseType {
  id: number;
  code: string;
  name: string;
  description: string;
  status: MasterDataStatus;
  createdAt: string;
  type?: OrganizationUnitType;
}

export type CategoryType = "organization" | "business";

export interface EnterpriseTypeFormData {
  code: string;
  name: string;
  description: string;
  status: MasterDataStatus;
  metadataJson?: Record<string, unknown> | null;
}
