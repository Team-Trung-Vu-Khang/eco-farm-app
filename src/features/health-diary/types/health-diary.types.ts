export type HealthStatusType = "DISEASE_DETECTED" | "UNDER_TREATMENT" | "HEALTHY";
export type HealthUpdateMethodType = "ZONE_SCOPE" | "INDIVIDUAL_PLANT";

export interface HealthDiaryRecord {
  id: number;
  code: string;
  zoneId: number | string;
  zoneName: string;
  methodType: HealthUpdateMethodType;

  // Geographic scope (ZONE_SCOPE)
  regionId?: number;
  regionName?: string;
  areaId?: number;
  areaName?: string;
  plotIds?: number[];
  targetScopeNames?: string[];

  // Individual plants (INDIVIDUAL_PLANT)
  plantCodes?: string[];
  plantCount?: number;

  // Form payload
  status: HealthStatusType;
  notes: string;
  imageUrls: string[];

  // Metadata
  createdBy: {
    id: number;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface HealthDiaryFilterState {
  searchQuery: string;
  methodType?: HealthUpdateMethodType | "ALL";
  status?: HealthStatusType | "ALL";
  dateFrom?: string;
  dateTo?: string;
}
