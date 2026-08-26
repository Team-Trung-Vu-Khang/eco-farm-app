// ─── Shared ───────────────────────────────────────────────────────────────────

export type FarmMasterDataStatus =
  | "active"
  | "inactive"
  | "archived"
  | (string & {});

export interface FarmPageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface FarmBaseQueryParams {
  keyword?: string;
  status?: FarmMasterDataStatus;
  onlyOwner?: boolean;
  page?: number;
  size?: number;
}

export interface FarmDocumentRequest {
  id?: number;
  documentType?: string;
  name?: string;
  fileUrl?: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  content?: string;
  [key: string]: any;
}

export interface FarmBankAccountRequest {
  id?: number;
  bankId?: number;
  ownerType?: string;
  ownerId?: number;
  bankCode?: string;
  bankName?: string;
  bin?: string;
  accountNumber?: string;
  accountHolder?: string;
  branch?: string;
  note?: string;
  logoUrl?: string;
  status?: FarmMasterDataStatus;
  isPrimary?: boolean;
  metadataJson?: Record<string, any>;
  [key: string]: any;
}

// ─── Farm Departments ──────────────────────────────────────────────────────────

export interface FarmDepartmentRequest {
  code?: string;
  name?: string;
  description?: string;
  displayOrder?: number;
  status?: FarmMasterDataStatus;
  masterDataDepartmentId?: number;
  metadataJson?: Record<string, any> | null;
  [key: string]: any;
}

export interface FarmDepartmentResponse {
  id: number;
  workspaceId: number;
  masterDataDepartmentId: number;
  code: string;
  name: string;
  description?: string;
  displayOrder?: number;
  status: FarmMasterDataStatus;
  metadataJson?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export type FarmDepartmentCreateRequest = FarmDepartmentRequest;
export type FarmDepartmentUpdateRequest = FarmDepartmentRequest;
export type FarmDepartmentDeleteResponse = void;

export interface DepartmentOptionResponse {
  id: number;
  code: string;
  name: string;
  source: "OWNER" | "MASTER";
  description?: string | null;
  displayOrder?: number;
}

export interface MasterDepartmentResponse {
  id: number;
  code: string;
  name: string;
  description?: string;
  displayOrder?: number;
  used?: boolean;
}

// ─── Farm Positions ──────────────────────────────────────────────────────────

export interface FarmPositionRequest {
  code?: string;
  name?: string;
  description?: string;
  responsibilityDescription?: string;
  displayOrder?: number;
  status?: FarmMasterDataStatus;
  metadataJson?: Record<string, any>;
  positionGroupId?: number;
  masterDataPositionId?: number;
  documents?: FarmDocumentRequest[];
  [key: string]: any;
}

export interface FarmPositionResponse {
  id: number;
  code: string;
  name: string;
  description?: string;
  displayOrder?: number;
  status: FarmMasterDataStatus;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface PositionOptionResponse {
  id: number;
  code: string;
  name: string;
  source: "OWNER" | "MASTER";
  status: FarmMasterDataStatus;
}

export interface MasterPositionResponse {
  id: number;
  code: string;
  name: string;
  description?: string;
  displayOrder?: number;
  positionGroupId?: number;
  positionGroupName?: string;
  used?: boolean;
}

// ─── Farm Position Responsibilities ───────────────────────────────────────────

export interface FarmPositionResponsibilityRequest {
  name?: string;
  description?: string;
  displayOrder?: number;
  status?: FarmMasterDataStatus;
  documents?: FarmDocumentRequest[];
  [key: string]: any;
}

export interface FarmPositionResponsibilityResponse {
  id: number;
  positionId: number;
  name: string;
  description?: string;
  displayOrder?: number;
  status: FarmMasterDataStatus;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface PositionResponsibilityQueryParams {
  status?: FarmMasterDataStatus;
}

// ─── Farm Teams ─────────────────────────────────────────────────────────────

export interface FarmTeamRequest {
  code?: string;
  name?: string;
  departmentId?: number;
  leaderId?: number;
  description?: string;
  displayOrder?: number;
  status?: FarmMasterDataStatus;
  metadataJson?: Record<string, any>;
  [key: string]: any;
}

export interface FarmTeamResponse {
  id: number;
  code: string;
  name: string;
  departmentId?: number;
  managerId?: number;
  description?: string;
  displayOrder?: number;
  status: FarmMasterDataStatus;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

// ─── Farm Personnel ─────────────────────────────────────────────────────────

export interface FarmPersonnelQueryParams extends FarmBaseQueryParams {
  teamId?: number;
  departmentId?: number;
}

export interface FarmPersonnelRequest {
  fullName?: string;
  phone?: string;
  email?: string;
  personalTaxCode?: string;
  taxAddress?: string;
  province?: string;
  ward?: string;
  address?: string;
  departmentType?: string;
  departmentId?: number;
  positionType?: string;
  positionId?: number;
  teamIds?: number[];
  avatarUrl?: string;
  status?: FarmMasterDataStatus;
  metadataJson?: Record<string, any>;
  bankAccounts?: FarmBankAccountRequest[];
  [key: string]: any;
}

export interface FarmPersonnelResponse {
  id: number;
  code: string;
  fullName: string;
  email?: string;
  phone?: string;
  positionId?: number;
  departmentId?: number;
  teams?: FarmTeamResponse[];
  status: FarmMasterDataStatus;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}
