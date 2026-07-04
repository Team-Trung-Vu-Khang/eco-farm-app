export type WorkspaceStatus = "active" | "inactive" | "archived" | (string & {});

export interface WorkspaceOrganizationType {
  id: number | string;
  code: string;
  name: string;
  type: string;
}

export interface WorkspaceBusinessLine {
  id: number | string;
  code: string;
  name: string;
}

export interface WorkspaceCrop {
  id: number | string;
  code: string;
  name: string;
}

export interface WorkspaceMetadata {
  [key: string]: unknown;
}

export interface WorkspaceRecord {
  id: number | string;
  organizationType: WorkspaceOrganizationType;
  code: string;
  name: string;
  brandName: string;
  taxCode: string;
  taxAuthority: string;
  taxAddress: string;
  issueDate: string;
  businessLines: WorkspaceBusinessLine[];
  totalAcreage: number;
  mainCrop: WorkspaceCrop | null;
  displayOrder: number;
  representative: string;
  foundedDate: string;
  website: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  description: string;
  status: WorkspaceStatus;
  metadataJson: WorkspaceMetadata | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceCreateRequest {
  organizationTypeId: number | string;
  code: string;
  name: string;
  brandName: string;
  taxCode: string;
  taxAuthority: string;
  taxAddress: string;
  issueDate: string;
  businessLines: WorkspaceBusinessLine[];
  totalAcreage?: number;
  mainCropId?: number | string | null;
  displayOrder?: number;
  representative: string;
  foundedDate: string;
  website: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  description: string;
  status: WorkspaceStatus;
  metadataJson?: WorkspaceMetadata | null;
}

export type WorkspaceUpdateRequest = WorkspaceCreateRequest;

export interface WorkspaceQueryParams {
  keyword?: string;
  status?: WorkspaceStatus;
  businessLine?: string;
  organizationTypeId?: number | string;
  page?: number;
  size?: number;
}

export interface WorkspacePageResponse<T = WorkspaceRecord> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
