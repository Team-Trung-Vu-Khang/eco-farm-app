import type { FarmPageResponse } from "@/features/master-data/types/farm-master-data.type";

export type FarmCertificateStatus = "valid" | "expired" | "revoked" | (string & {});

export type FarmCertificateTargetType =
  | "workspace"
  | "region"
  | (string & {});

export interface FarmCertificateMasterDataRef {
  id: number | string;
  code: string;
  name: string;
}

export interface FarmCertificateIssuerRecord {
  id: number | string;
  code: string;
  name: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  description: string;
  status: "active" | "inactive" | "archived" | (string & {});
  createdAt: string;
  updatedAt: string;
}

export interface FarmCertificateDocumentRecord {
  id: number | string;
  documentType: string;
  name: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  displayOrder: number;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FarmCertificateDocumentRequest {
  id?: number | string;
  documentType: string;
  name: string;
  fileUrl?: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  displayOrder?: number;
  content?: string;
}

export interface FarmCertificateRecord {
  id: number | string;
  code: string;
  name: string;
  agricultureCertificate: FarmCertificateMasterDataRef;
  issuer: FarmCertificateIssuerRecord;
  agricultureCertificateId?: number | string;
  issuerId?: number | string;
  standardType?: string;
  organization?: string;
  issuedDate: string;
  expiryDate: string;
  targetType: FarmCertificateTargetType;
  targetId?: number | string;
  targetRegions?: FarmCertificateMasterDataRef[];
  targetOrganization?: FarmCertificateMasterDataRef | null;
  targetRegion?: FarmCertificateMasterDataRef | null;
  documents: FarmCertificateDocumentRecord[];
  status: FarmCertificateStatus;
  displayOrder: number;
  metadataJson: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface FarmCertificateQueryParams {
  keyword?: string;
  status?: FarmCertificateStatus;
  standardType?: string;
  targetType?: FarmCertificateTargetType;
  page?: number;
  size?: number;
}

export interface FarmCertificateCreateRequest {
  code: string;
  name: string;
  agricultureCertificateId: number | string;
  issuerId: number | string;
  issuedDate: string;
  expiryDate: string;
  targetType: FarmCertificateTargetType;
  targetIds?: Array<number | string>;
  displayOrder?: number;
  documents?: FarmCertificateDocumentRequest[];
  metadataJson?: Record<string, unknown> | null;
}

export type FarmCertificateCreateResponse = FarmCertificateRecord;
export type FarmCertificateUpdateRequest = FarmCertificateCreateRequest;
export type FarmCertificateUpdateResponse = FarmCertificateRecord;
export type FarmCertificateDeleteResponse = void;

export type FarmCertificatePageResponse<T = FarmCertificateRecord> =
  FarmPageResponse<T>;
