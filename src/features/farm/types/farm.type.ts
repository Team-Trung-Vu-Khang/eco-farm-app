import type { FoundationStatus } from "../../foundation/types/foundation.type";

export interface FarmDocumentRequest {
  id?: number;
  documentType?: string;
  name?: string;
  fileUrl?: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  displayOrder?: number;
  content?: string;
}

export interface FarmDocumentResponse {
  id: number;
  documentType?: string;
  name?: string;
  fileUrl?: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  displayOrder?: number;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FarmSeedRequest {
  cropVarietyId: number;
  code?: string;
  name?: string;
  supplierOrganizationId: number;
  origin?: string;
  avgYieldFrom?: number;
  avgYieldTo?: number;
  germinationRate?: number;
  purityRate?: number;
  imageUrl?: string;
  displayOrder?: number;
  status?: FoundationStatus;
  documents?: FarmDocumentRequest[];
  metadataJson?: Record<string, unknown>;
}

export interface FarmSeedResponse {
  id: number;
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  code?: string;
  name?: string;
  subjectVariant?: {
    id: number;
    code?: string;
    name?: string;
  };
  productionSubject?: {
    id: number;
    name?: string;
  };
  cropVariety?: {
    id: number;
    code?: string;
    name?: string;
  };
  crop?: {
    id: number;
    name?: string;
  };
  supplier: {
    id: number;
    code?: string;
    name?: string;
  };
  origin?: string;
  avgYieldFrom?: number;
  avgYieldTo?: number;
  germinationRate?: number;
  purityRate?: number;
  imageUrl?: string;
  displayOrder?: number;
  status: FoundationStatus;
  documents?: FarmDocumentResponse[];
  metadataJson?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SeedQueryParams {
  keyword?: string;
  supplierOrganizationId?: number;
  status?: FoundationStatus;
  page?: number;
  size?: number;
  productionMethodId?: number;
  domainCode?: string;
  foundationSubjectVariantId?: number;
  productionSubjectId?: number;
}

export interface CoordinatePoint {
  latitude?: number;
  longitude?: number;
}

export interface CatalogRef {
  id: number;
  code?: string;
  name?: string;
}

export interface RegionRef {
  id: number;
  code?: string;
  name?: string;
}

export interface AreaRef {
  id: number;
  code?: string;
  name?: string;
  region?: RegionRef;
}

export interface FarmRegionRequest {
  code?: string;
  name?: string;
  acreage?: number;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  soilTypeId?: number;
  terrainFeatureId?: number;
  boundary?: CoordinatePoint[];
  description?: string;
  status?: FoundationStatus;
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
  crops?: { cropId: number; role: "MAIN" | "SUB" }[];
  areas?: FarmAreaRequest[];
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
}

export interface FarmRegionResponse {
  id: number;
  workspaceId?: number;
  code?: string;
  name?: string;
  acreage?: number;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  soilType?: CatalogRef;
  terrainFeature?: CatalogRef;
  boundary?: CoordinatePoint[];
  centerPoint?: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  status?: FoundationStatus;
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
  crops?: {
    cropId?: number;
    crop?: { id: number; name?: string };
    role?: string;
  }[];
  areas?: FarmAreaResponse[];
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  createdAt?: string;
  updatedAt?: string;
}

export interface RegionQueryParams {
  keyword?: string;
  status?: FoundationStatus;
  page?: number;
  size?: number;
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
}

export interface FarmAreaRequest {
  regionId?: number;
  id?: number;
  code?: string;
  name?: string;
  acreage?: number;
  soilTypeId?: number;
  terrainFeatureId?: number;
  boundary?: CoordinatePoint[];
  centerPoint?: CoordinatePoint;
  status?: FoundationStatus;
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
  plots?: FarmPlotRequest[];
}

export interface FarmAreaResponse {
  id: number;
  workspaceId?: number;
  region?: RegionRef;
  code?: string;
  name?: string;
  acreage?: number;
  soilType?: CatalogRef;
  terrainFeature?: CatalogRef;
  boundary?: CoordinatePoint[];
  centerPoint?: CoordinatePoint;
  status?: FoundationStatus;
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
  plots?: FarmPlotResponse[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AreaQueryParams {
  regionId?: number;
  keyword?: string;
  status?: FoundationStatus;
  page?: number;
  size?: number;
}

export interface FarmPlotRequest {
  id?: number;
  code?: string;
  name?: string;
  acreage?: number;
  elevation?: number;
  contourInterval?: number;
  boundary?: CoordinatePoint[];
  status?: FoundationStatus;
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
}

export interface FarmPlotResponse {
  id: number;
  workspaceId?: number;
  area?: AreaRef;
  code?: string;
  name?: string;
  acreage?: number;
  elevation?: number;
  contourInterval?: number;
  boundary?: CoordinatePoint[];
  status?: FoundationStatus;
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlotQueryParams {
  areaId?: number;
  keyword?: string;
  status?: FoundationStatus;
  page?: number;
  size?: number;
}

// ─── Cultivation Zone ─────────────────────────────────────────────────────────

export type FarmCultivationZoneScopeType = "REGION" | "AREA" | "PLOT";

export type FarmCultivationZoneStatus = "active" | "inactive" | "archived";

export interface FarmCultivationZoneScopeRequest {
  scopeType: FarmCultivationZoneScopeType;
  scopeId: number;
}

export interface PlotRef {
  id: number;
  code?: string;
  name?: string;
  area?: AreaRef;
}

export interface PersonnelRef {
  id: number;
  fullName?: string;
  avatarUrl?: string;
  position?: CatalogRef;
}

export interface SeedRef {
  id: number;
  cropVarietyCode?: string;
  cropVarietyName?: string;
  cropName?: string;
}

export interface SubjectVariantRef {
  id: number;
  subjectVariantCode?: string;
  subjectVariantName?: string;
  productionSubjectName?: string;
}

export interface FarmCultivationZoneScopeResponse {
  scopeType: FarmCultivationZoneScopeType;
  region?: RegionRef;
  area?: AreaRef;
  plot?: PlotRef;
}

export interface FarmCultivationZoneRequest {
  code?: string;
  name?: string;
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  scopes?: FarmCultivationZoneScopeRequest[];
  certificateIds?: number[];
  personnelIds?: number[];
  farmingMethodId: number;
  rearingMethodId?: number;
  seedIds?: number[];
  notes?: string;
  status?: FarmCultivationZoneStatus;
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
}

export interface FarmCultivationZoneResponse {
  id: number;
  code?: string;
  name?: string;
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  scopes?: FarmCultivationZoneScopeResponse[];
  certificates?: CatalogRef[];
  personnel?: PersonnelRef[];
  farmingMethod?: CatalogRef;
  productionMethod?: CatalogRef;
  rearingMethod?: CatalogRef;
  seeds?: SeedRef[];
  notes?: string;
  subjectVariants?: SubjectVariantRef[];
  status?: FarmCultivationZoneStatus;
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  centerPoint?: {
    latitude: number;
    longitude: number;
  };
}

export interface CultivationZoneQueryParams {
  keyword?: string;
  status?: FarmCultivationZoneStatus;
  farmingMethodId?: number;
  rearingMethodId?: number;
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  page?: number;
  size?: number;
}

// ─── Plant Identification ───────────────────────────────────────────────────

export interface FarmPlantIdentificationRequest {
  code?: string;
  location: FarmCultivationZoneScopeRequest;
  cultivationZoneId?: number;
  productionZoneId?: number;
  height?: number;
  durationDays?: number;
  plantedAt?: string;
  startedAt?: string;
  latitude: number;
  longitude: number;
  notes?: string;
  status?: "active" | "inactive" | "archived";
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
}

export interface FarmPlantIdentificationResponse {
  id: number;
  workspaceId?: number;
  location?: FarmCultivationZoneScopeResponse;
  cultivationZone?: CatalogRef;
  productionZone?: CatalogRef;
  code?: string;
  height?: number;
  durationDays?: number;
  plantedAt?: string;
  startedAt?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  status: "active" | "inactive" | "archived";
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
  createdAt?: string;
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  updatedAt?: string;
}

export interface PlantIdentificationQueryParams {
  regionId?: number;
  areaId?: number;
  plotId?: number;
  cultivationZoneId?: number;
  keyword?: string;
  status?: string;
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  page?: number;
  size?: number;
}
