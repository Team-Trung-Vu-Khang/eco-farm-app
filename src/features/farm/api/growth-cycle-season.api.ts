import { apiClient } from "@/shared/lib/axios";
import { FARM_ENDPOINTS, MASTER_DATA_PATHS } from "@/shared/constants";
import type { PageResponse } from "@/features/foundation/types/foundation.type";

export const farmGrowthCycleSeasonApi = {
  list: (params?: any) =>
    apiClient
      .get<PageResponse<any>>(FARM_ENDPOINTS.seasons, { params })
      .then((r) => r.data),

  getById: (id: string | number) =>
    apiClient
      .get<any>(`${FARM_ENDPOINTS.seasons}/${id}`)
      .then((r) => r.data),

  create: (data: any) =>
    apiClient
      .post<any>(FARM_ENDPOINTS.seasons, data)
      .then((r) => r.data),

  update: (id: string | number, data: any) =>
    apiClient
      .put<any>(`${FARM_ENDPOINTS.seasons}/${id}`, data)
      .then((r) => r.data),

  delete: (id: string | number) =>
    apiClient.delete(`${FARM_ENDPOINTS.seasons}/${id}`).then((r) => r.data),
};

export const systemGrowthCycleSeasonApi = {
  list: (params?: any) =>
    apiClient
      .get<PageResponse<any>>(MASTER_DATA_PATHS.seasons, { params })
      .then((r) => r.data),

  getById: (id: string | number) =>
    apiClient
      .get<any>(`${MASTER_DATA_PATHS.seasons}/${id}`)
      .then((r) => r.data),
};
