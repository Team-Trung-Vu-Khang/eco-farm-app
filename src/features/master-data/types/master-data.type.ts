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
  "position-groups": Record<string, unknown>;
  positions: Record<string, never>;
}

export interface MasterDataRequestExtraFieldsMap {
  positions: {
    positionGroupId?: number | null;
    responsibilityDescription?: string | null;
    documents?: PositionResponsibilityDocumentInput[];
  };
}

export interface MasterDataRecordExtraFieldsMap {
  positions: {
    positionGroupId?: number | null;
    positionGroup?: PositionGroup | null;
    responsibilityDescription?: string | null;
    documents?: PositionResponsibilityDocument[];
  };
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
