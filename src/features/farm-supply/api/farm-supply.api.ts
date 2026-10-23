import { apiClient } from "@/shared/lib/axios";
import {
  ADMIN_MASTER_DATA_PATHS,
  FARM_ENDPOINTS,
  FOUNDATION_ENDPOINTS,
  MASTER_DATA_PATHS,
} from "@/shared/constants";
import type {
  SupplyType,
  DomainCode,
  SupplyQueryParams,
  SupplyItemRequest,
  SupplyItemResponse,
  CatalogRef,
  ClassificationGroup,
} from "../types";
import type { PageResponse } from "../../foundation/types/foundation.type";

const SUPPLY_PATHS: Record<SupplyType, string> = {
  medicine: "medicines",
  fertilizer: "fertilizers",
  material: "materials",
  equipment: "equipment", // singular!
  biological: "biological-products",
  by_product: "by-products",
};

export const farmSupplyApi = {
  listAllSupplies: (params?: SupplyQueryParams) => {
    return apiClient
      .get<PageResponse<SupplyItemResponse>>(FARM_ENDPOINTS.supplies, {
        params,
      })
      .then((r) => r.data);
  },

  list: (
    type: SupplyType,
    params?: SupplyQueryParams,
    scope: "admin" | "farm" = "farm",
  ) => {
    const path = SUPPLY_PATHS[type];
    const url =
      scope === "admin"
        ? `${ADMIN_MASTER_DATA_PATHS.base}/${path}`
        : `${FARM_ENDPOINTS.supplies}/${path}`;
    return apiClient
      .get<PageResponse<SupplyItemResponse>>(url, {
        params,
      })
      .then((r) => r.data);
  },

  getById: (
    type: SupplyType,
    id: number,
    source: "MASTER" | "OWNER",
    scope: "admin" | "farm" = "farm",
  ) => {
    const path = SUPPLY_PATHS[type];
    const url =
      scope === "admin"
        ? `${ADMIN_MASTER_DATA_PATHS.base}/${path}/${id}`
        : source === "MASTER"
          ? `${MASTER_DATA_PATHS.base}/${path}/${id}`
          : `${FARM_ENDPOINTS.supplies}/${path}/${id}`;
    return apiClient.get<SupplyItemResponse>(url).then((r) => r.data);
  },

  create: (
    type: SupplyType,
    data: SupplyItemRequest,
    scope: "admin" | "farm" = "farm",
  ) => {
    const path = SUPPLY_PATHS[type];
    const url =
      scope === "admin"
        ? `${ADMIN_MASTER_DATA_PATHS.base}/${path}`
        : `${FARM_ENDPOINTS.supplies}/${path}`;
    return apiClient.post<SupplyItemResponse>(url, data).then((r) => r.data);
  },

  update: (
    type: SupplyType,
    id: number,
    data: SupplyItemRequest,
    scope: "admin" | "farm" = "farm",
  ) => {
    const path = SUPPLY_PATHS[type];
    const url =
      scope === "admin"
        ? `${ADMIN_MASTER_DATA_PATHS.base}/${path}/${id}`
        : `${FARM_ENDPOINTS.supplies}/${path}/${id}`;
    return apiClient.put<SupplyItemResponse>(url, data).then((r) => r.data);
  },

  delete: (type: SupplyType, id: number, scope: "admin" | "farm" = "farm") => {
    const path = SUPPLY_PATHS[type];
    const url =
      scope === "admin"
        ? `${ADMIN_MASTER_DATA_PATHS.base}/${path}/${id}`
        : `${FARM_ENDPOINTS.supplies}/${path}/${id}`;
    return apiClient.delete(url);
  },

  listPackagingTypes: () => {
    return apiClient
      .get<PageResponse<CatalogRef>>(MASTER_DATA_PATHS.packagingTypes, {
        params: { status: "active", page: 0, size: 100 },
      })
      .then((r) => r.data?.content ?? []);
  },

  listBaseUnits: (unitType?: string) => {
    return apiClient
      .get<PageResponse<CatalogRef>>(MASTER_DATA_PATHS.unitsBase, {
        params: { status: "active", page: 0, size: 100, unitType },
      })
      .then((r) => r.data?.content ?? []);
  },

  listCertificateStandards: () => {
    return apiClient
      .get<PageResponse<CatalogRef>>(MASTER_DATA_PATHS.certificateStandards, {
        params: { status: "active", page: 0, size: 100 },
      })
      .then((r) => r.data?.content ?? []);
  },

  getClassificationGroups: (
    type: SupplyType,
    classification?: string,
    domainCode?: DomainCode,
  ) => {
    const catalog =
      type === "equipment"
        ? "material-groups"
        : type === "biological"
          ? "biological-product-groups"
          : type === "by_product"
            ? "by-product-groups"
            : `${type}-groups`;
    return apiClient
      .get<PageResponse<ClassificationGroup>>(`${MASTER_DATA_PATHS.base}/${catalog}`, {
        params: {
          status: "active",
          page: 0,
          size: 100,
          classification,
          ...(domainCode ? { domainCode } : {}),
        },
      })
      .then((r) => r.data?.content ?? []);
  },

  getTargetSubjects: (domainCode: string) => {
    return apiClient
      .get<PageResponse<any>>(FOUNDATION_ENDPOINTS.crops, {
        params: { status: "active", page: 0, size: 100, domainCode },
      })
      .then((r) => r.data?.content ?? []);
  },
};
