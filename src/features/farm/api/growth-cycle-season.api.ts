import { apiClient } from "@/shared/lib/axios";
import type { PageResponse } from "@/features/foundation/types/foundation.type";

export const farmGrowthCycleSeasonApi = {
  list: (params?: any) =>
    apiClient
      .get<PageResponse<any>>("/api/farm/seasons", { params })
      .then((r) => r.data),

  getById: (id: string | number) =>
    apiClient
      .get<any>(`/api/farm/seasons/${id}`)
      .then((r) => r.data),

  create: (data: any) =>
    apiClient
      .post<any>("/api/farm/seasons", data)
      .then((r) => r.data),

  update: (id: string | number, data: any) =>
    apiClient
      .put<any>(`/api/farm/seasons/${id}`, data)
      .then((r) => r.data),

  delete: (id: string | number) =>
    apiClient.delete(`/api/farm/seasons/${id}`).then((r) => r.data),
};

export const systemGrowthCycleSeasonApi = {
  list: (params?: any) =>
    apiClient
      .get<PageResponse<any>>("/api/master-data/seasons", { params })
      .then((r) => r.data),

  getById: (id: string | number) =>
    apiClient
      .get<any>(`/api/master-data/seasons/${id}`)
      .then((r) => r.data),
};
