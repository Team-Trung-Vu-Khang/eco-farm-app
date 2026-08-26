export type BankAccountStatus = "active" | "inactive" | "archived" | (string & {});
export type BankAccountOwnerType =
  | "WORKSPACE"
  | "ORGANIZATION"
  | "BRANCH"
  | "PERSONNEL"
  | (string & {});
export type BankAccountSource = "OWNER" | "SYSTEM" | (string & {});

export interface BankRecord {
  id: number | string;
  code: string;
  name: string;
  shortName?: string;
  bin?: string;
  logoUrl?: string;
  swiftCode?: string;
  transferSupported?: boolean;
  lookupSupported?: boolean;
}

export interface BankAccountMetadata {
  [key: string]: unknown;
}

export interface BankAccountRecord {
  id: number | string;
  source?: BankAccountSource;
  ownerType?: BankAccountOwnerType;
  ownerId?: number | string;
  bankId?: number | string;
  bank?: BankRecord | null;
  accountNumber?: string;
  accountHolder?: string;
  branch?: string;
  note?: string;
  isPrimary?: boolean;
  status?: BankAccountStatus;
  displayOrder?: number;
  metadataJson?: BankAccountMetadata | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BankAccountPageResponse<T = BankAccountRecord> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface BankAccountQueryParams {
  keyword?: string;
  status?: BankAccountStatus;
  /** Limits accounts to a particular owner; ownerId requires this value. */
  ownerType?: BankAccountOwnerType;
  ownerId?: number | string;
  /** When true, excludes system sample data and returns workspace-owned accounts only. */
  onlyOwner?: boolean;
  page?: number;
  size?: number;
}

export interface BankAccountDeleteRequest {
  id: number | string;
  workspaceId: number | string;
}

export interface BankAccountRequest {
  id?: number | string;
  bankId?: number | string;
  accountNumber: string;
  accountHolder: string;
  branch?: string;
  note?: string;
  status?: BankAccountStatus;
  displayOrder?: number;
  isPrimary?: boolean;
  metadataJson?: BankAccountMetadata | null;
}

export type BankAccountCreateRequest = BankAccountRequest;
export type BankAccountUpdateRequest = BankAccountRequest;
export type BankAccountCreateResponse = BankAccountRecord;
export type BankAccountUpdateResponse = BankAccountRecord;
