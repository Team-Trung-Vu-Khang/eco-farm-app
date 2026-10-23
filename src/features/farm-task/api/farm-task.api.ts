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

import { FARM_ENDPOINTS } from "@/shared/constants";

export const farmTaskApi = {
  list(params?: FarmTaskQueryParams) {
    return apiClient
      .get<FarmTaskPageResponse>(FARM_ENDPOINTS.tasks, { params })
      .then((response) => response.data);
  },

  getById(id: number | string) {
    return apiClient
      .get<FarmTaskResponse>(`${FARM_ENDPOINTS.tasks}/${id}`)
      .then((response) => response.data);
  },

  stats(params?: FarmTaskStatsQueryParams) {
    return apiClient
      .get<FarmTaskStatsResponse>(`${FARM_ENDPOINTS.tasks}/stats`, { params })
      .then((response) => response.data);
  },

  calendar(params: FarmTaskCalendarQueryParams) {
    return apiClient
      .get<FarmTaskCalendarResponse>(`${FARM_ENDPOINTS.tasks}/calendar`, { params })
      .then((response) => response.data);
  },

  calendarDay(date: string, params?: FarmTaskCalendarDayQueryParams) {
    return apiClient
      .get<FarmTaskCalendarDayResponse>(`${FARM_ENDPOINTS.tasks}/calendar/${date}`, { params })
      .then((response) => response.data);
  },

  create(payload: FarmTaskRequest) {
    return apiClient
      .post<FarmTaskResponse>(FARM_ENDPOINTS.tasks, payload)
      .then((response) => response.data);
  },

  bulkCreate(payload: FarmTaskBulkCreateRequest) {
    return apiClient
      .post<FarmTaskResponse[]>(`${FARM_ENDPOINTS.tasks}/bulk`, payload)
      .then((response) => response.data);
  },

  update(id: number | string, payload: FarmTaskRequest) {
    return apiClient
      .put<FarmTaskResponse>(`${FARM_ENDPOINTS.tasks}/${id}`, payload)
      .then((response) => response.data);
  },

  delete(id: number | string) {
    return apiClient.delete(`${FARM_ENDPOINTS.tasks}/${id}`).then(() => undefined);
  },

};
