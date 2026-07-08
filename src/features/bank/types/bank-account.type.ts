export type BankAccountStatus = "active" | "inactive" | "archived" | (string & {});

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
  ownerType?: string;
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
  ownerType?: string;
  ownerId?: number | string;
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
