import { apiClient } from "@/shared/lib/axios";
import type {
  SupplyConversionRuleResponse,
  SupplyConversionRuleRequest,
  SupplyConversionRuleQueryParams,
  DeletionImpactResponse,
} from "../types/supply-conversion-rule.type";
import type { SupplyType } from "../types";

// ─── Page response wrapper (same shape as other paginated endpoints) ─────────

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// ─── Path helpers ────────────────────────────────────────────────────────────

import { ADMIN_MASTER_DATA_PATHS, FARM_ENDPOINTS } from "@/shared/constants";

const SUPPLY_PATH_SEGMENTS: Record<SupplyType, string> = {
  medicine: "medicines",
  fertilizer: "fertilizers",
  material: "materials",
  equipment: "equipment",
  biological: "biological-products",
  by_product: "by-products",
};

// ─── API ─────────────────────────────────────────────────────────────────────

export const supplyConversionRuleApi = {
  // ─── Admin Master Data ──────────────────────────────────────────────────────

  adminList: (params?: SupplyConversionRuleQueryParams) =>
    apiClient
      .get<PageResponse<SupplyConversionRuleResponse>>(FARM_ENDPOINTS.adminSupplyConversionRules, { params })
      .then((r) => r.data),

  adminGetById: (id: number) =>
    apiClient
      .get<SupplyConversionRuleResponse>(`${FARM_ENDPOINTS.adminSupplyConversionRules}/${id}`)
      .then((r) => r.data),

  adminCreate: (data: SupplyConversionRuleRequest) =>
    apiClient
      .post<SupplyConversionRuleResponse>(FARM_ENDPOINTS.adminSupplyConversionRules, data)
      .then((r) => r.data),

  adminUpdate: (id: number, data: SupplyConversionRuleRequest) =>
    apiClient
      .put<SupplyConversionRuleResponse>(`${FARM_ENDPOINTS.adminSupplyConversionRules}/${id}`, data)
      .then((r) => r.data),

  adminDelete: (id: number): Promise<void> =>
    apiClient.delete(`${FARM_ENDPOINTS.adminSupplyConversionRules}/${id}`).then(() => undefined),

  // ─── Farm Owner (requires X-Workspace-Id, set by axios interceptor) ────────

  farmList: (params?: SupplyConversionRuleQueryParams) =>
    apiClient
      .get<PageResponse<SupplyConversionRuleResponse>>(FARM_ENDPOINTS.supplyConversionRules, { params })
      .then((r) => r.data),

  farmGetById: (id: number) =>
    apiClient
      .get<SupplyConversionRuleResponse>(`${FARM_ENDPOINTS.supplyConversionRules}/${id}`)
      .then((r) => r.data),

  farmCreate: (data: SupplyConversionRuleRequest) =>
    apiClient
      .post<SupplyConversionRuleResponse>(FARM_ENDPOINTS.supplyConversionRules, data)
      .then((r) => r.data),

  farmUpdate: (id: number, data: SupplyConversionRuleRequest) =>
    apiClient
      .put<SupplyConversionRuleResponse>(`${FARM_ENDPOINTS.supplyConversionRules}/${id}`, data)
      .then((r) => r.data),

  farmDelete: (id: number): Promise<void> =>
    apiClient.delete(`${FARM_ENDPOINTS.supplyConversionRules}/${id}`).then(() => undefined),

  // ─── Deletion Impact ───────────────────────────────────────────────────────
  // Used before deleting a supply item to check if any conversion rules reference it.

  /**
   * @param scope  "admin" → `/api/admin/master-data/{type}/{id}/deletion-impact`
   *               "farm"  → `/api/farm/supplies/{type}/{id}/deletion-impact`
   */
  checkDeletionImpact: (
    scope: "admin" | "farm",
    supplyType: SupplyType,
    id: number,
    params?: { page?: number; size?: number },
  ) => {
    const segment = SUPPLY_PATH_SEGMENTS[supplyType];
    const basePath =
      scope === "admin"
        ? `${ADMIN_MASTER_DATA_PATHS.base}/${segment}`
        : `${FARM_ENDPOINTS.supplies}/${segment}`;
    return apiClient
      .get<DeletionImpactResponse>(`${basePath}/${id}/deletion-impact`, {
        params,
      })
      .then((r) => r.data);
  },
};
