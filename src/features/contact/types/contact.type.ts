export type ContactStatus = "active" | "inactive" | "archived" | (string & {});
export type ContactDepartmentType = "OWNER" | "MASTER" | (string & {});

export interface ContactWorkspaceRecord {
  id: number | string;
  name: string;
}

export interface ContactGroupSummaryRecord {
  id: number | string;
  name: string;
}

export interface ContactDepartmentRecord {
  id: number | string;
  name: string;
}

export interface ContactRecord {
  id: number | string;
  workspace?: ContactWorkspaceRecord | null;
  group?: ContactGroupSummaryRecord | null;
  department?: ContactDepartmentRecord | null;
  fullName: string;
  name: string;
  phone: string;
  email?: string | null;
  position?: string | null;
  entityName?: string | null;
  note?: string | null;
  isPrimary?: boolean;
  status: ContactStatus;
  metadataJson?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactPageResponse<T = ContactRecord> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ContactQueryParams {
  keyword?: string;
  groupId?: number | string;
  status?: ContactStatus;
  page?: number;
  size?: number;
}

export interface ContactCommonRequest {
  fullName: string;
  name?: string;
  phone: string;
  email?: string | null;
  position?: string | null;
  groupId?: number | string | null;
  departmentType?: ContactDepartmentType | null;
  departmentId?: number | string | null;
  note?: string | null;
  isPrimary?: boolean;
  status?: ContactStatus;
  metadataJson?: Record<string, unknown> | null;
}

export interface ContactLinkRequest {
  contactId?: number | string | null;
  name: string;
  position?: string | null;
  phone?: string | null;
  email?: string | null;
  displayOrder?: number;
  isPrimary?: boolean;
}

export type ContactCreateRequest = ContactCommonRequest;
export type ContactUpdateRequest = ContactCommonRequest;
export type ContactCreateResponse = ContactRecord;
export type ContactUpdateResponse = ContactRecord;
