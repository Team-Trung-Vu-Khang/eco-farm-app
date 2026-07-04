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
  cropVariety: {
    id: number;
    code?: string;
    name?: string;
  };
  crop: {
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
  description?: string;
  status?: FoundationStatus;
  displayOrder?: number;
  metadataJson?: Record<string, unknown>;
  crops?: { cropId?: number; crop?: { id: number; name?: string }; role?: string }[];
  areas?: FarmAreaResponse[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RegionQueryParams {
  keyword?: string;
  status?: FoundationStatus;
  page?: number;
  size?: number;
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
