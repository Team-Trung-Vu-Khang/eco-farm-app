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

const ADMIN_BASE = "/api/admin/master-data/supply-conversion-rules";
const FARM_BASE = "/api/farm/supplies/conversion-rules";

const SUPPLY_PATH_SEGMENTS: Record<SupplyType, string> = {
  medicine: "medicines",
  fertilizer: "fertilizers",
  material: "materials",
  equipment: "equipment",
};

// ─── API ─────────────────────────────────────────────────────────────────────

export const supplyConversionRuleApi = {
  // ─── Admin Master Data ──────────────────────────────────────────────────────

  adminList: (params?: SupplyConversionRuleQueryParams) =>
    apiClient
      .get<PageResponse<SupplyConversionRuleResponse>>(ADMIN_BASE, { params })
      .then((r) => r.data),

  adminGetById: (id: number) =>
    apiClient
      .get<SupplyConversionRuleResponse>(`${ADMIN_BASE}/${id}`)
      .then((r) => r.data),

  adminCreate: (data: SupplyConversionRuleRequest) =>
    apiClient
      .post<SupplyConversionRuleResponse>(ADMIN_BASE, data)
      .then((r) => r.data),

  adminUpdate: (id: number, data: SupplyConversionRuleRequest) =>
    apiClient
      .put<SupplyConversionRuleResponse>(`${ADMIN_BASE}/${id}`, data)
      .then((r) => r.data),

  adminDelete: (id: number): Promise<void> =>
    apiClient.delete(`${ADMIN_BASE}/${id}`).then(() => undefined),

  // ─── Farm Owner (requires X-Workspace-Id, set by axios interceptor) ────────

  farmList: (params?: SupplyConversionRuleQueryParams) =>
    apiClient
      .get<PageResponse<SupplyConversionRuleResponse>>(FARM_BASE, { params })
      .then((r) => r.data),

  farmGetById: (id: number) =>
    apiClient
      .get<SupplyConversionRuleResponse>(`${FARM_BASE}/${id}`)
      .then((r) => r.data),

  farmCreate: (data: SupplyConversionRuleRequest) =>
    apiClient
      .post<SupplyConversionRuleResponse>(FARM_BASE, data)
      .then((r) => r.data),

  farmUpdate: (id: number, data: SupplyConversionRuleRequest) =>
    apiClient
      .put<SupplyConversionRuleResponse>(`${FARM_BASE}/${id}`, data)
      .then((r) => r.data),

  farmDelete: (id: number): Promise<void> =>
    apiClient.delete(`${FARM_BASE}/${id}`).then(() => undefined),

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
        ? `/api/admin/master-data/${segment}`
        : `/api/farm/supplies/${segment}`;
    return apiClient
      .get<DeletionImpactResponse>(`${basePath}/${id}/deletion-impact`, {
        params,
      })
      .then((r) => r.data);
  },
};
