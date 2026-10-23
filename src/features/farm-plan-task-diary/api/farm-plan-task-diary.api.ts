import { apiClient } from "@/shared/lib/axios";
import type {
  CreatePlanTaskDiaryEntryRequest,
  UpdatePlanTaskDiaryEntryRequest,
  PlanTaskDiaryEntryPageResponse,
  PlanTaskDiaryEntryResponse,
  PlanTaskDiaryQueryParams,
  PlanTaskDiaryStatsResponse,
} from "../types/farm-plan-task-diary.type";

import { FARM_ENDPOINTS } from "@/shared/constants";

export const farmPlanTaskDiaryApi = {
  list(params?: PlanTaskDiaryQueryParams) {
    return apiClient
      .get<PlanTaskDiaryEntryPageResponse>(FARM_ENDPOINTS.planTaskDiaryEntries, { params })
      .then((response) => response.data);
  },

  getStats(params?: PlanTaskDiaryQueryParams) {
    return apiClient
      .get<PlanTaskDiaryStatsResponse>(`${FARM_ENDPOINTS.planTaskDiaryEntries}/stats`, { params })
      .then((response) => response.data);
  },


  getById(id: string | number) {
    return apiClient
      .get<PlanTaskDiaryEntryResponse>(`${FARM_ENDPOINTS.planTaskDiaryEntries}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreatePlanTaskDiaryEntryRequest) {
    return apiClient
      .post<PlanTaskDiaryEntryResponse>(FARM_ENDPOINTS.planTaskDiaryEntries, payload)
      .then((response) => response.data);
  },

  update(id: string | number, payload: UpdatePlanTaskDiaryEntryRequest) {
    return apiClient
      .put<PlanTaskDiaryEntryResponse>(`${FARM_ENDPOINTS.planTaskDiaryEntries}/${id}`, payload)
      .then((response) => response.data);
  },

  getTaskHistory(taskId: string | number, params?: { page?: number; size?: number }) {
    return apiClient
      .get<PlanTaskDiaryEntryPageResponse>(`${FARM_ENDPOINTS.tasks}/${taskId}/plan-diary-entries`, { params })
      .then((response) => response.data);
  },
};
