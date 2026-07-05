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
  bank?: BankRecord | null;
  accountNumber?: string;
  accountHolder?: string;
  branch?: string;
  note?: string;
  isPrimary?: boolean;
  status?: BankAccountStatus;
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

export interface BankAccountCommonRequest {
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
  status?: BankAccountStatus;
  isPrimary?: boolean;
  metadataJson?: BankAccountMetadata | null;
}

export type BankAccountCreateRequest = BankAccountCommonRequest;
export type BankAccountUpdateRequest = BankAccountCommonRequest;
export type BankAccountCreateResponse = BankAccountRecord;
export type BankAccountUpdateResponse = BankAccountRecord;
