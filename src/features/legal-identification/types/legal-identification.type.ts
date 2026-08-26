import type { FarmPageResponse } from "@/features/master-data/types/farm-master-data.type";

export type LegalIdentificationStatus =
  | "draft"
  | "pending"
  | "approved"
  | (string & {});

export type LegalIdentificationScopeType = "REGION" | "AREA" | "PLOT";

export interface LegalIdentificationRegionRef {
  id: number;
  code: string;
  name: string;
}

export interface LegalIdentificationAreaRef {
  id: number;
  code: string;
  name: string;
  region?: LegalIdentificationRegionRef;
}

export interface LegalIdentificationPlotRef {
  id: number;
  code: string;
  name: string;
  area?: LegalIdentificationAreaRef;
}

export interface LegalIdentificationScopeResponse {
  scopeType: LegalIdentificationScopeType;
  region?: LegalIdentificationRegionRef;
  area?: LegalIdentificationAreaRef;
  plot?: LegalIdentificationPlotRef;
}

export interface LegalIdentificationScopeRequest {
  scopeType: LegalIdentificationScopeType;
  scopeId: number;
}

export interface LegalIdentificationDocumentResponse {
  id: number;
  documentType: string;
  name: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  displayOrder: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegalIdentificationDocumentRequest {
  id?: number;
  documentType: string;
  name: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  displayOrder: number;
  content: string;
}

export interface LegalIdentificationResponse {
  id: number;
  workspaceId: number;
  code: string;
  name: string;
  scopes: LegalIdentificationScopeResponse[];
  plotAddress?: string;
  status: LegalIdentificationStatus;
  legalDocuments: LegalIdentificationDocumentResponse[];
  surveyDocuments: LegalIdentificationDocumentResponse[];
  purposeDocuments: LegalIdentificationDocumentResponse[];
  notes?: string;
  displayOrder?: number;
  metadataJson?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface LegalIdentificationQueryParams {
  regionId?: number;
  areaId?: number;
  plotId?: number;
  keyword?: string;
  status?: LegalIdentificationStatus;
  page?: number;
  size?: number;
}

export interface LegalIdentificationUpsertRequest {
  code: string;
  name: string;
  plotAddress: string;
  status: LegalIdentificationStatus;
  scopes: LegalIdentificationScopeRequest[];
  legalDocuments: LegalIdentificationDocumentRequest[];
  surveyDocuments: LegalIdentificationDocumentRequest[];
  purposeDocuments: LegalIdentificationDocumentRequest[];
  notes: string;
  displayOrder: number;
  metadataJson: Record<string, unknown>;
}

export type LegalIdentificationCreateRequest = LegalIdentificationUpsertRequest;
export type LegalIdentificationUpdateRequest = LegalIdentificationUpsertRequest;
export type LegalIdentificationPageResponse =
  FarmPageResponse<LegalIdentificationResponse>;
export type LegalIdentificationCreateResponse = LegalIdentificationResponse;
export type LegalIdentificationUpdateResponse = LegalIdentificationResponse;
export type LegalIdentificationDeleteResponse = void;
