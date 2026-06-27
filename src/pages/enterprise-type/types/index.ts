import type {
  MasterDataStatus,
  VsicIndustryRecord,
} from "@/features/master-data/types/master-data.type";

export type VsicIndustry = VsicIndustryRecord;

export type VsicIndustryFormData = {
  code: string;
  name: string;
  level: number;
  parentCode?: string | null;
  displayOrder: number;
  status: MasterDataStatus;
  metadataJson?: Record<string, unknown> | null;
};
