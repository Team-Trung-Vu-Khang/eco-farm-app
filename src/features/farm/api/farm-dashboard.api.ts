import { apiClient } from "@/shared/lib/axios";
import { FARM_ENDPOINTS } from "@/shared/constants";
import type { PageResponse } from "@/features/foundation/types/foundation.type";
import type {
  LowStockSuppliesResponse,
  ExpiringContractsResponse,
  ProductionHealthResponse,
  HarvestProductionResponse,
  HarvestProductionQueryParams,
} from "../types/farm-dashboard.type";

export const farmDashboardApi = {
  // 1. Expiring Certificates (GET /api/farm/certificates?status=expiring_soon)
  getExpiringCertificates: (params?: {
    page?: number;
    size?: number;
  }): Promise<PageResponse<any>> =>
    apiClient
      .get<PageResponse<any>>(FARM_ENDPOINTS.certificates, {
        params: { status: "expiring_soon", page: 0, size: 20, ...params },
      })
      .then((r) => r.data),

  // 2. Low Stock Supplies (GET /api/farm/dashboard/low-stock-supplies)
  getLowStockSupplies: (): Promise<LowStockSuppliesResponse> =>
    apiClient
      .get<LowStockSuppliesResponse>(FARM_ENDPOINTS.dashboardLowStockSupplies)
      .then((r) => r.data),

  // 3. Expiring Contracts (GET /api/farm/dashboard/expiring-contracts?windowDays=7)
  getExpiringContracts: (windowDays = 7): Promise<ExpiringContractsResponse> =>
    apiClient
      .get<ExpiringContractsResponse>(FARM_ENDPOINTS.dashboardExpiringContracts, {
        params: { windowDays },
      })
      .then((r) => r.data),

  // 4. Production Health (GET /api/farm/dashboard/production-health)
  getProductionHealth: (): Promise<ProductionHealthResponse> =>
    apiClient
      .get<ProductionHealthResponse>(FARM_ENDPOINTS.dashboardProductionHealth)
      .then((r) => r.data),

  // 5. Harvest Production (GET /api/farm/dashboard/harvest-production)
  getHarvestProduction: (
    params?: HarvestProductionQueryParams,
  ): Promise<HarvestProductionResponse> =>
    apiClient
      .get<HarvestProductionResponse>(FARM_ENDPOINTS.dashboardHarvestProduction, {
        params,
      })
      .then((r) => r.data),
};
