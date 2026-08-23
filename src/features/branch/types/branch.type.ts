export type BranchStatus = "active" | "inactive" | "archived" | (string & {});

export interface BranchOrganizationRecord {
  id: number | string;
  code?: string;
  name: string;
}

export interface BranchWorkspaceRecord {
  id: number | string;
  name: string;
}

export interface BranchGroupRecord {
  id: number | string;
  name: string;
}

export interface BranchDepartmentRecord {
  id: number | string;
  name: string;
}

export interface BranchContactRecord {
  id: number | string;
  workspace?: BranchWorkspaceRecord | null;
  group?: BranchGroupRecord | null;
  department?: BranchDepartmentRecord | null;
  fullName?: string;
  name?: string;
  phone?: string;
  email?: string | null;
  position?: string | null;
  entityName?: string | null;
  note?: string | null;
  isPrimary?: boolean;
  status?: BranchStatus;
  metadataJson?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BranchBankRecord {
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
  status?: BranchStatus;
  metadataJson?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BranchMetadata {
  [key: string]: unknown;
}

export interface BranchRecord {
  id: number | string;
  organizationId?: number | string;
  organization?: BranchOrganizationRecord | null;
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
  status?: BranchStatus;
  contacts?: BranchContactRecord[];
  bankAccounts?: BranchBankRecord[];
  metadataJson?: BranchMetadata | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BranchPageResponse<T = BranchRecord> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface BranchQueryParams {
  keyword?: string;
  status?: BranchStatus;
  organizationId?: number | string;
  page?: number;
  size?: number;
}

export interface BranchContactRequest {
  contactId?: number | string;
  name: string;
  position?: string;
  phone?: string;
  email?: string;
  isPrimary?: boolean;
}

export interface BranchBankRequest {
  id?: number | string;
  bankId?: number | string;
  ownerType?: string;
  ownerId?: number | string;
  bankCode: string;
  bankName: string;
  bin?: string;
  accountNumber: string;
  accountHolder: string;
  branch?: string;
  note?: string;
  logoUrl?: string;
  status?: BranchStatus;
  isPrimary?: boolean;
  metadataJson?: Record<string, unknown> | null;
}

export interface BranchCommonRequest {
  id?: number | string;
  organizationId: number | string;
  code: string;
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
  status?: BranchStatus;
  contacts?: BranchContactRequest[];
  bankAccounts?: BranchBankRequest[];
  metadataJson?: BranchMetadata | null;
}

export type BranchCreateRequest = BranchCommonRequest;
export type BranchUpdateRequest = BranchCommonRequest;
