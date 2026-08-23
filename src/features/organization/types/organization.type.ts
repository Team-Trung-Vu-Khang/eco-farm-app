export type OrganizationStatus =
  | "active"
  | "inactive"
  | "archived"
  | (string & {});

export interface OrganizationTypeRecord {
  id: number | string;
  code?: string;
  name: string;
  type: string;
}

export interface OrganizationBusinessLineRecord {
  id: number | string;
  code: string;
  name: string;
}

export interface OrganizationContactRecord {
  id: number | string;
  workspace?: {
    id: number | string;
    name: string;
  } | null;
  group?: {
    id: number | string;
    name: string;
  } | null;
  department?: {
    id: number | string;
    name: string;
  } | null;
  fullName?: string;
  name?: string;
  phone?: string;
  email?: string;
  position?: string;
  entityName?: string;
  note?: string;
  isPrimary?: boolean;
  status?: OrganizationStatus;
  metadataJson?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrganizationContactRequest {
  contactId?: number | string;
  name: string;
  position?: string;
  phone?: string;
  email?: string;
  isPrimary?: boolean;
}

export interface OrganizationBankRecord {
  id: number | string;
  ownerType?: string;
  ownerId?: number | string;
  bank?: {
    id: number | string;
    code: string;
    name: string;
    shortName?: string;
    bin?: string;
    logoUrl?: string;
    swiftCode?: string;
    transferSupported?: boolean;
    lookupSupported?: boolean;
  } | null;
  accountNumber?: string;
  accountHolder?: string;
  branch?: string;
  note?: string;
  isPrimary?: boolean;
  status?: OrganizationStatus;
  metadataJson?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrganizationBankRequest {
  id?: number | string;
  ownerType?: string;
  ownerId?: number | string;
  bankId?: number | string;
  bankCode: string;
  bankName: string;
  bin?: string;
  accountNumber: string;
  accountHolder: string;
  branch?: string;
  note?: string;
  logoUrl?: string;
  status?: OrganizationStatus;
  isPrimary?: boolean;
  metadataJson?: Record<string, unknown> | null;
}

export interface OrganizationBranchRecord {
  id: number | string;
  organization?: {
    id: number | string;
    code: string;
    name: string;
  } | null;
  code?: string;
  name?: string;
  taxCode?: string;
  taxAddress?: string;
  website?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  status?: OrganizationStatus;
  contacts?: OrganizationContactRecord[];
  bankAccounts?: OrganizationBankRecord[];
  metadataJson?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrganizationBranchRequest {
  id?: number | string;
  organizationId?: number | string;
  code?: string;
  name: string;
  taxCode?: string;
  taxAddress?: string;
  website?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  status?: OrganizationStatus;
  contacts?: OrganizationContactRequest[];
  bankAccounts?: OrganizationBankRequest[];
  metadataJson?: Record<string, unknown> | null;
}

export interface OrganizationDocumentRecord {
  id: number | string;
  workspaceId?: number | string;
  ownerType?: string;
  ownerId?: number | string;
  documentType?: string;
  name?: string;
  fileUrl?: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrganizationDocumentRequest {
  id?: number | string;
  documentType: string;
  name: string;
  fileUrl?: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  content?: string;
}

export interface OrganizationMetadata {
  [key: string]: unknown;
}

export interface OrganizationRecord {
  id: number | string;
  workspaceId?: number | string;
  type: string;
  organizationType: OrganizationTypeRecord;
  code: string;
  name: string;
  brandName: string;
  taxCode: string;
  taxAuthority: string;
  taxAddress: string;
  issueDate: string;
  businessLines: OrganizationBusinessLineRecord[];
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
  status: OrganizationStatus;
  contacts: OrganizationContactRecord[];
  branches: OrganizationBranchRecord[];
  bankAccounts: OrganizationBankRecord[];
  documents: OrganizationDocumentRecord[];
  metadataJson: OrganizationMetadata | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationCreateRequest {
  type: "enterprise" | "farm" | "cooperative" | (string & {});
  organizationTypeId: number | string;
  code: string;
  name: string;
  brandName?: string;
  taxCode?: string;
  taxAuthority?: string;
  taxAddress?: string;
  issueDate?: string;
  businessLines?: OrganizationBusinessLineRecord[];
  representative?: string;
  foundedDate?: string;
  website?: string;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  description?: string;
  status?: OrganizationStatus;
  contacts?: OrganizationContactRequest[];
  branches?: OrganizationBranchRequest[];
  bankAccounts?: OrganizationBankRequest[];
  documents?: OrganizationDocumentRequest[];
  metadataJson?: OrganizationMetadata | null;
}

export type OrganizationUpdateRequest = OrganizationCreateRequest;

export interface OrganizationQueryParams {
  type?: string;
  keyword?: string;
  status?: OrganizationStatus;
  businessLine?: string;
  onlyOwner?: boolean;
  page?: number;
  size?: number;
}

export interface OrganizationPageResponse<T = OrganizationRecord> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
