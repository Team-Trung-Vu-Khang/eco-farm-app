export type BankDirectoryStatus = "active" | "inactive" | "archived";

export interface BankDirectoryMetadata {
  [key: string]: unknown;
}

export interface BankDirectoryItem {
  id: number;
  code: string;
  bin: string;
  shortName: string;
  name: string;
  logoUrl: string;
  swiftCode: string | null;
  transferSupported: boolean;
  lookupSupported: boolean;
  displayOrder: number;
  status: BankDirectoryStatus;
  metadataJson: BankDirectoryMetadata | null;
  createdAt: string;
  updatedAt: string;
}

export interface BankDirectoryCreateRequest {
  code: string;
  bin: string;
  shortName: string;
  name: string;
  logoUrl: string;
  swiftCode?: string | null;
  transferSupported: boolean;
  lookupSupported: boolean;
  displayOrder: number;
  status: BankDirectoryStatus;
  metadataJson?: BankDirectoryMetadata | null;
}

export type BankDirectoryCreateResponse = BankDirectoryItem;
export type BankDirectoryUpdateRequest = BankDirectoryCreateRequest;
export type BankDirectoryUpdateResponse = BankDirectoryItem;
export type BankDirectoryDeleteResponse = void;

export interface BankDirectoryResponse<T = BankDirectoryItem> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface BankDirectoryQueryParams {
  keyword?: string;
  transferSupported?: boolean;
  lookupSupported?: boolean;
  status?: BankDirectoryStatus;
  page?: number;
  size?: number;
}
