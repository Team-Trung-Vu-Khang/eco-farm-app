import { apiClient } from "@/shared/lib/axios";
import type {
  SupplyType,
  SupplyQueryParams,
  SupplyItemRequest,
  SupplyItemResponse,
  CatalogRef,
} from "../types";
import type { PageResponse } from "../../foundation/types/foundation.type";

const SUPPLY_PATHS: Record<SupplyType, string> = {
  medicine: "medicines",
  fertilizer: "fertilizers",
  material: "materials",
  equipment: "equipment", // singular!
};

export const farmSupplyApi = {
  list: (type: SupplyType, params?: SupplyQueryParams) => {
    const path = SUPPLY_PATHS[type];
    return apiClient
      .get<PageResponse<SupplyItemResponse>>(`/api/farm/supplies/${path}`, {
        params,
      })
      .then((r) => r.data);
  },

  getById: (type: SupplyType, id: number, source: "MASTER" | "OWNER") => {
    const path = SUPPLY_PATHS[type];
    const url =
      source === "MASTER"
        ? `/api/master-data/${path}/${id}`
        : `/api/farm/supplies/${path}/${id}`;
    return apiClient.get<SupplyItemResponse>(url).then((r) => r.data);
  },

  create: (type: SupplyType, data: SupplyItemRequest) => {
    const path = SUPPLY_PATHS[type];
    return apiClient
      .post<SupplyItemResponse>(`/api/farm/supplies/${path}`, data)
      .then((r) => r.data);
  },

  update: (type: SupplyType, id: number, data: SupplyItemRequest) => {
    const path = SUPPLY_PATHS[type];
    return apiClient
      .put<SupplyItemResponse>(`/api/farm/supplies/${path}/${id}`, data)
      .then((r) => r.data);
  },

  delete: (type: SupplyType, id: number) => {
    const path = SUPPLY_PATHS[type];
    return apiClient.delete(`/api/farm/supplies/${path}/${id}`);
  },

  listPackagingTypes: () => {
    return apiClient
      .get<PageResponse<CatalogRef>>("/api/master-data/packaging-types", {
        params: { status: "active", page: 0, size: 100 },
      })
      .then((r) => r.data?.content ?? []);
  },

  listBaseUnits: (unitType?: string) => {
    return apiClient
      .get<PageResponse<CatalogRef>>("/api/master-data/units-base", {
        params: { status: "active", page: 0, size: 100, unitType },
      })
      .then((r) => r.data?.content ?? []);
  },

  listCertificateStandards: () => {
    return apiClient
      .get<PageResponse<CatalogRef>>("/api/master-data/certificate-standards", {
        params: { status: "active", page: 0, size: 100 },
      })
      .then((r) => r.data?.content ?? []);
  },

  getClassificationGroups: (type: SupplyType) => {
    const catalog =
      type === "equipment"
        ? "equipment-tool-groups"
        : `${type}-groups`;
    return apiClient
      .get<PageResponse<any>>(`/api/master-data/${catalog}`, {
        params: { status: "active", page: 0, size: 100 },
      })
      .then((r) => r.data?.content ?? []);
  },

  getTargetSubjects: (domainCode: string) => {
    return apiClient
      .get<PageResponse<any>>("/api/admin/foundation/production/subjects", {
        params: { status: "active", page: 0, size: 100, domainCode },
      })
      .then((r) => r.data?.content ?? []);
  },
};
