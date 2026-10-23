import { apiClient } from "@/shared/lib/axios";
import type {
  FarmPlanPageResponse,
  FarmPlanQueryParams,
  FarmPlanRequest,
  FarmPlanResponse,
  FarmPlanStageRequest,
  FarmPlanStageResponse,
  FarmWorkflowPageResponse,
  FarmWorkflowQueryParams,
  FarmWorkflowRequest,
  FarmWorkflowResponse,
  FarmWorkflowStatsQueryParams,
  FarmWorkflowStatsResponse,
} from "../types/farm-workflow.type";

import { FARM_ENDPOINTS } from "@/shared/constants";

export const farmWorkflowApi = {
  list(params?: FarmWorkflowQueryParams) {
    return apiClient
      .get<FarmWorkflowPageResponse>(FARM_ENDPOINTS.workflows, { params })
      .then((response) => response.data);
  },

  getById(id: number | string) {
    return apiClient
      .get<FarmWorkflowResponse>(`${FARM_ENDPOINTS.workflows}/${id}`)
      .then((response) => response.data);
  },

  stats(params?: FarmWorkflowStatsQueryParams) {
    return apiClient
      .get<FarmWorkflowStatsResponse>(`${FARM_ENDPOINTS.workflows}/stats`, {
        params,
      })
      .then((response) => response.data);
  },

  listPlans(
    workflowId: number | string,
    params?: Omit<FarmPlanQueryParams, "workflowId" | "cultivationZoneId" | "purpose">,
  ) {
    return apiClient
      .get<FarmPlanPageResponse>(`${FARM_ENDPOINTS.workflows}/${workflowId}/plans`, {
        params,
      })
      .then((response) => response.data);
  },

  create(payload: FarmWorkflowRequest) {
    return apiClient
      .post<FarmWorkflowResponse>(FARM_ENDPOINTS.workflows, payload)
      .then((response) => response.data);
  },

  update(id: number | string, payload: FarmWorkflowRequest) {
    return apiClient
      .put<FarmWorkflowResponse>(`${FARM_ENDPOINTS.workflows}/${id}`, payload)
      .then((response) => response.data);
  },

  delete(id: number | string) {
    return apiClient.delete(`${FARM_ENDPOINTS.workflows}/${id}`).then(() => undefined);
  },
};

export const farmPlanApi = {
  /** `workspaceId` ghi đè X-Workspace-Id (xem KH của vùng thuộc workspace khác) */
  list(params?: FarmPlanQueryParams, workspaceId?: number) {
    return apiClient
      .get<FarmPlanPageResponse>(FARM_ENDPOINTS.plans, {
        params,
        headers: workspaceId ? { "X-Workspace-Id": workspaceId } : undefined,
      })
      .then((response) => response.data);
  },

  getById(
    id: number | string,
    params?: Pick<FarmPlanQueryParams, "includeAdHocStages">,
  ) {
    return apiClient
      .get<FarmPlanResponse>(`${FARM_ENDPOINTS.plans}/${id}`, { params })
      .then((response) => response.data);
  },

  create(workflowId: number | string, payload: FarmPlanRequest) {
    return apiClient
      .post<FarmPlanResponse>(`${FARM_ENDPOINTS.workflows}/${workflowId}/plans`, payload)
      .then((response) => response.data);
  },

  createAdHocStage(id: number | string, payload: FarmPlanStageRequest) {
    return apiClient
      .post<FarmPlanStageResponse>(`${FARM_ENDPOINTS.plans}/${id}/stages/ad-hoc`, payload)
      .then((response) => response.data);
  },

  update(id: number | string, payload: FarmPlanRequest) {
    return apiClient
      .put<FarmPlanResponse>(`${FARM_ENDPOINTS.plans}/${id}`, payload)
      .then((response) => response.data);
  },

  delete(id: number | string) {
    return apiClient.delete(`${FARM_ENDPOINTS.plans}/${id}`).then(() => undefined);
  },
};
