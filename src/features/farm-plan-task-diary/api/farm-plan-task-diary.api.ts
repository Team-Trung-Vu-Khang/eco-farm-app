import { apiClient } from "@/shared/lib/axios";
import type {
  CreatePlanTaskDiaryEntryRequest,
  UpdatePlanTaskDiaryEntryRequest,
  PlanTaskDiaryEntryPageResponse,
  PlanTaskDiaryEntryResponse,
  PlanTaskDiaryQueryParams,
  PlanTaskDiaryStatsResponse,
} from "../types/farm-plan-task-diary.type";

const PLAN_TASK_DIARY_PATH = "/api/farm/plan-task-diary-entries" as const;

export const farmPlanTaskDiaryApi = {
  list(params?: PlanTaskDiaryQueryParams) {
    return apiClient
      .get<PlanTaskDiaryEntryPageResponse>(PLAN_TASK_DIARY_PATH, { params })
      .then((response) => response.data);
  },

  getStats(params?: PlanTaskDiaryQueryParams) {
    return apiClient
      .get<PlanTaskDiaryStatsResponse>(`${PLAN_TASK_DIARY_PATH}/stats`, { params })
      .then((response) => response.data);
  },


  getById(id: string | number) {
    return apiClient
      .get<PlanTaskDiaryEntryResponse>(`${PLAN_TASK_DIARY_PATH}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreatePlanTaskDiaryEntryRequest) {
    return apiClient
      .post<PlanTaskDiaryEntryResponse>(PLAN_TASK_DIARY_PATH, payload)
      .then((response) => response.data);
  },

  update(id: string | number, payload: UpdatePlanTaskDiaryEntryRequest) {
    return apiClient
      .put<PlanTaskDiaryEntryResponse>(`${PLAN_TASK_DIARY_PATH}/${id}`, payload)
      .then((response) => response.data);
  },

  getTaskHistory(taskId: string | number, params?: { page?: number; size?: number }) {
    return apiClient
      .get<PlanTaskDiaryEntryPageResponse>(`/api/farm/tasks/${taskId}/plan-diary-entries`, { params })
      .then((response) => response.data);
  },
};
