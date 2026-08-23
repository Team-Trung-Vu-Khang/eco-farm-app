import { apiClient } from "@/shared/lib/axios";
import type {
  FarmTaskBulkCreateRequest,
  FarmTaskCalendarDayQueryParams,
  FarmTaskCalendarDayResponse,
  FarmTaskCalendarQueryParams,
  FarmTaskCalendarResponse,
  FarmTaskPageResponse,
  FarmTaskQueryParams,
  FarmTaskRequest,
  FarmTaskResponse,
  FarmTaskStatsQueryParams,
  FarmTaskStatsResponse,
} from "../types/farm-task.type";

const FARM_TASK_PATH = "/api/farm/tasks" as const;

export const farmTaskApi = {
  list(params?: FarmTaskQueryParams) {
    return apiClient
      .get<FarmTaskPageResponse>(FARM_TASK_PATH, { params })
      .then((response) => response.data);
  },

  getById(id: number | string) {
    return apiClient
      .get<FarmTaskResponse>(`${FARM_TASK_PATH}/${id}`)
      .then((response) => response.data);
  },

  stats(params?: FarmTaskStatsQueryParams) {
    return apiClient
      .get<FarmTaskStatsResponse>(`${FARM_TASK_PATH}/stats`, { params })
      .then((response) => response.data);
  },

  calendar(params: FarmTaskCalendarQueryParams) {
    return apiClient
      .get<FarmTaskCalendarResponse>(`${FARM_TASK_PATH}/calendar`, { params })
      .then((response) => response.data);
  },

  calendarDay(date: string, params?: FarmTaskCalendarDayQueryParams) {
    return apiClient
      .get<FarmTaskCalendarDayResponse>(`${FARM_TASK_PATH}/calendar/${date}`, { params })
      .then((response) => response.data);
  },

  create(payload: FarmTaskRequest) {
    return apiClient
      .post<FarmTaskResponse>(FARM_TASK_PATH, payload)
      .then((response) => response.data);
  },

  bulkCreate(payload: FarmTaskBulkCreateRequest) {
    return apiClient
      .post<FarmTaskResponse[]>(`${FARM_TASK_PATH}/bulk`, payload)
      .then((response) => response.data);
  },

  update(id: number | string, payload: FarmTaskRequest) {
    return apiClient
      .put<FarmTaskResponse>(`${FARM_TASK_PATH}/${id}`, payload)
      .then((response) => response.data);
  },

  delete(id: number | string) {
    return apiClient.delete(`${FARM_TASK_PATH}/${id}`).then(() => undefined);
  },

};
