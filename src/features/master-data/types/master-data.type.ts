import type { MasterDataCatalog } from "@/shared/constants/master-data.constants";

export type { MasterDataCatalog } from "@/shared/constants/master-data.constants";

export type MasterDataStatus =
  | "active"
  | "inactive"
  | "archived"
  | (string & {});

export interface MasterDataPageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface MasterDataQueryParams {
  keyword?: string;
  status?: MasterDataStatus;
  page?: number;
  size?: number;
  level?: number;
  parentId?: number;
  parentCode?: string;
}

export interface VsicIndustryTreeQueryParams {
  rootCode?: string;
  status?: MasterDataStatus;
}

export interface PositionGroup {
  id: number;
  code: string;
  name: string;
}

export type PositionResponsibilityDocumentType = "editor" | "pdf";

export interface PositionResponsibilityDocumentInput {
  id?: number;
  type: PositionResponsibilityDocumentType;
  name: string;
  content?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface MasterDataAttributesMap {
  banks: Record<string, unknown>;
  "business-lines": Record<string, unknown>;
  departments: Record<string, unknown>;
  "equipment-tool-groups": Record<string, unknown>;
  "fertilizer-groups": Record<string, unknown>;
  "iot-device-groups": Record<string, unknown>;
  "material-groups": Record<string, unknown>;
  "pesticide-groups": Record<string, unknown>;
  "pesticide-origins": Record<string, unknown>;
  "pesticide-toxicity-classes": {
    whoGroup?: string;
    bandColor?: string;
    ld50Threshold?: string;
  };
  "plan-groups": Record<string, unknown>;
  "plan-types": Record<string, unknown>;
  "position-groups": Record<string, unknown>;
  positions: Record<string, never>;
  "certificate-issuers": Record<string, unknown>;
  "certificate-standards": Record<string, unknown>;
  "pesticide-groups": Record<string, unknown>;
  "vsic-industries": Record<string, unknown>;
}

export interface MasterDataRequestExtraFieldsMap {
  positions: {
    positionGroupId?: number | null;
    responsibilityDescription?: string | null;
    documents?: PositionResponsibilityDocumentInput[];
  };
  "certificate-issuers": {
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    address?: string | null;
  };
  "certificate-standards": {
    stampUrl?: string | null;
    validityMonths?: number | null;
    issuerIds?: number[];
    documents?: CertificateStandardDocumentInput[];
  };
  "pesticide-groups": Record<string, never>;
  "plan-types": {
    color: string;
    planGroupId?: number | null;
  };
  "vsic-industries": {
    level: number;
    parentCode?: string | null;
    parentId?: number | null;
  };
}

export interface MasterDataRecordExtraFieldsMap {
  positions: {
    positionGroupId?: number | null;
    positionGroup?: PositionGroup | null;
    responsibilityDescription?: string | null;
    documents?: PositionResponsibilityDocument[];
  };
  "certificate-issuers": {
    phone: string;
    email: string;
    website: string;
    address: string;
  };
  "certificate-standards": {
    stampUrl: string;
    validityMonths: number;
    issuers: CertificateIssuerRecord[];
    documents: CertificateStandardDocument[];
  };
  "pesticide-groups": Record<string, never>;
  "plan-types": {
    color: string;
    planGroup?: PlanGroupRecord | null;
  };
  "vsic-industries": {
    level: number;
    parentId?: number | null;
    parentCode?: string | null;
    parentName?: string | null;
  };
}

export interface CertificateIssuerFields {
  phone: string;
  email: string;
  website: string;
  address: string;
}

export interface CertificateStandardIssuerInput {
  id?: number;
  code?: string;
  name?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  description?: string;
  status?: MasterDataStatus;
}

export interface CertificateStandardDocumentInput {
  id?: number;
  type: PositionResponsibilityDocumentType;
  name: string;
  content?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface CertificateStandardDocument {
  id: number;
  type: PositionResponsibilityDocumentType;
  name: string;
  content: string;
  fileUrl: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
}

export type MasterDataAttributes<C extends MasterDataCatalog> =
  C extends keyof MasterDataAttributesMap
    ? MasterDataAttributesMap[C]
    : Record<string, unknown>;

export type MasterDataRequestExtraFields<C extends MasterDataCatalog> =
  C extends keyof MasterDataRequestExtraFieldsMap
    ? MasterDataRequestExtraFieldsMap[C]
    : Record<string, never>;

export type MasterDataRecordExtraFields<C extends MasterDataCatalog> =
  C extends keyof MasterDataRecordExtraFieldsMap
    ? MasterDataRecordExtraFieldsMap[C]
    : Record<string, never>;

export type MasterDataRecord<
  C extends MasterDataCatalog = MasterDataCatalog,
  TAttributes = MasterDataAttributes<C>,
> = MasterDataRecordExtraFields<C> & {
  id: number;
  code: string;
  name: string;
  description?: string;
  displayOrder?: number;
  status: MasterDataStatus;
  metadataJson?: Record<string, unknown> | null;
  attributes?: TAttributes;
  createdAt: string;
  updatedAt: string;
};

export interface MasterDataCommonFields {
  code: string;
  name: string;
  description?: string;
  displayOrder?: number;
  status: MasterDataStatus;
  metadataJson?: Record<string, unknown> | null;
}

export type MasterDataCreateRequest<
  C extends MasterDataCatalog = MasterDataCatalog,
  TAttributes = MasterDataAttributes<C>,
> = MasterDataCommonFields & MasterDataRequestExtraFields<C> & {
  attributes?: TAttributes;
};

export type MasterDataUpdateRequest<
  C extends MasterDataCatalog = MasterDataCatalog,
  TAttributes = MasterDataAttributes<C>,
> = MasterDataCommonFields & MasterDataRequestExtraFields<C> & {
  attributes?: TAttributes;
};

export type MasterDataDeleteResponse = void;

export type MasterDataRecordRequest<
  C extends MasterDataCatalog = MasterDataCatalog,
  TAttributes = MasterDataAttributes<C>,
> = MasterDataCreateRequest<C, TAttributes>;

export interface PositionResponsibilityDocument {
  id: number;
  type: PositionResponsibilityDocumentType;
  name: string;
  content: string;
  fileUrl: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
}

export interface PositionResponsibilityItem {
  id: number;
  positionId: number;
  name: string;
  description?: string;
  displayOrder?: number;
  status: MasterDataStatus;
  documents: PositionResponsibilityDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface PositionResponsibilitiesQueryParams {
  status?: MasterDataStatus;
}

export type PositionResponsibilitiesResponse = PositionResponsibilityItem[];

export type CertificateIssuerRecord = MasterDataRecord<"certificate-issuers">;
export type BusinessLineRecord = MasterDataRecord<"business-lines">;
export type PesticideGroupRecord = MasterDataRecord<"pesticide-groups">;
export type PlanGroupRecord = MasterDataRecord<"plan-groups">;
export type PesticideGroupCreateRequest = MasterDataCreateRequest<"pesticide-groups">;
export type PesticideGroupUpdateRequest = MasterDataUpdateRequest<"pesticide-groups">;
export type PlanGroupCreateRequest = MasterDataCreateRequest<"plan-groups">;
export type PlanGroupUpdateRequest = MasterDataUpdateRequest<"plan-groups">;

export type CertificateIssuerCreateRequest =
  MasterDataCreateRequest<"certificate-issuers"> &
    Partial<CertificateIssuerFields>;

export type CertificateIssuerUpdateRequest =
  MasterDataUpdateRequest<"certificate-issuers"> &
    Partial<CertificateIssuerFields>;

export type CertificateStandardRecord = MasterDataRecord<"certificate-standards">;
export type PlanTypeRecord = MasterDataRecord<"plan-types">;
export type VsicIndustryRecord = MasterDataRecord<"vsic-industries">;
export type VsicIndustryChildrenRecord = VsicIndustryRecord[];
export type VsicIndustryTreeRecord = VsicIndustryRecord & {
  children?: Array<VsicIndustryTreeRecord | string>;
};
export type VsicIndustryTreeResponse = VsicIndustryTreeRecord[];
export type PlanTypePageResponse = MasterDataPageResponse<PlanTypeRecord>;

export type BusinessLineCreateRequest = MasterDataCreateRequest<"business-lines">;
export type BusinessLineUpdateRequest = MasterDataUpdateRequest<"business-lines">;

export interface VsicIndustryMutationRequest {
  code: string;
  name: string;
  level: number;
  parentCode?: string | null;
  displayOrder: number;
  status: MasterDataStatus;
  metadataJson?: Record<string, unknown> | null;
}

export type VsicIndustryCreateRequest = VsicIndustryMutationRequest;
export type VsicIndustryUpdateRequest = VsicIndustryMutationRequest;

export interface PlanTypeMutationRequest {
  code: string;
  name: string;
  color: string;
  description: string;
  planGroupId: number;
  displayOrder: number;
  status: MasterDataStatus;
  metadataJson?: Record<string, unknown> | null;
}

export type PlanTypeCreateRequest = PlanTypeMutationRequest;
export type PlanTypeUpdateRequest = PlanTypeMutationRequest;

export interface CertificateStandardCreateRequest {
  code: string;
  name: string;
  stampUrl: string;
  description?: string;
  validityMonths: number;
  issuerIds: number[];
  documents?: CertificateStandardDocumentInput[];
  status: MasterDataStatus;
  metadataJson?: Record<string, unknown> | null;
}

export interface CertificateStandardUpdateRequest {
  code: string;
  name: string;
  stampUrl: string;
  description?: string;
  validityMonths: number;
  issuerIds: number[];
  documents?: CertificateStandardDocumentInput[];
  status: MasterDataStatus;
  metadataJson?: Record<string, unknown> | null;
}
