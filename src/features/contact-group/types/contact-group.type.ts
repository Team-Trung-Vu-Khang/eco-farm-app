export type ContactGroupStatus = "active" | "inactive" | "archived" | (string & {});

export interface ContactGroupRecord {
  id: number | string;
  workspaceId: number | string;
  code: string;
  name: string;
  description: string;
  status: ContactGroupStatus;
  metadataJson: Record<string, unknown> | null;
  contactCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactGroupQueryParams {
  keyword?: string;
  status?: ContactGroupStatus;
  page?: number;
  size?: number;
}

export interface ContactGroupPageResponse<T = ContactGroupRecord> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ContactGroupCommonRequest {
  code: string;
  name: string;
  description?: string;
  status?: ContactGroupStatus;
  metadataJson?: Record<string, unknown> | null;
}

export type ContactGroupCreateRequest = ContactGroupCommonRequest;

export type ContactGroupUpdateRequest = ContactGroupCommonRequest;

export type ContactGroupCreateResponse = ContactGroupRecord;
export type ContactGroupUpdateResponse = ContactGroupRecord;
