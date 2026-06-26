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
  positions: {
    departmentId?: number;
  };
}

export type MasterDataAttributes<C extends MasterDataCatalog> =
  C extends keyof MasterDataAttributesMap
    ? MasterDataAttributesMap[C]
    : Record<string, unknown>;

export interface MasterDataRecord<
  C extends MasterDataCatalog = MasterDataCatalog,
  TAttributes = MasterDataAttributes<C>,
> {
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
}

export interface MasterDataCommonFields {
  code: string;
  name: string;
  description?: string;
  displayOrder?: number;
  status: MasterDataStatus;
  metadataJson?: Record<string, unknown> | null;
}

export interface MasterDataCreateRequest<
  C extends MasterDataCatalog = MasterDataCatalog,
  TAttributes = MasterDataAttributes<C>,
> extends MasterDataCommonFields {
  attributes?: TAttributes;
}

export interface MasterDataUpdateRequest<
  C extends MasterDataCatalog = MasterDataCatalog,
  TAttributes = MasterDataAttributes<C>,
> extends MasterDataCommonFields {
  attributes?: TAttributes;
}

export type MasterDataDeleteResponse = void;

export type MasterDataRecordRequest<
  C extends MasterDataCatalog = MasterDataCatalog,
  TAttributes = MasterDataAttributes<C>,
> = MasterDataCreateRequest<C, TAttributes>;
