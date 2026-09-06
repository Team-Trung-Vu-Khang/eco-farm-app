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

const FARM_WORKFLOW_PATH = "/api/farm/workflows" as const;
const FARM_PLAN_PATH = "/api/farm/plans" as const;

export const farmWorkflowApi = {
  list(params?: FarmWorkflowQueryParams) {
    return apiClient
      .get<FarmWorkflowPageResponse>(FARM_WORKFLOW_PATH, { params })
      .then((response) => response.data);
  },

  getById(id: number | string) {
    return apiClient
      .get<FarmWorkflowResponse>(`${FARM_WORKFLOW_PATH}/${id}`)
      .then((response) => response.data);
  },

  stats(params?: FarmWorkflowStatsQueryParams) {
    return apiClient
      .get<FarmWorkflowStatsResponse>(`${FARM_WORKFLOW_PATH}/stats`, {
        params,
      })
      .then((response) => response.data);
  },

  listPlans(workflowId: number | string, params?: Omit<FarmPlanQueryParams, "workflowId">) {
    return apiClient
      .get<FarmPlanPageResponse>(`${FARM_WORKFLOW_PATH}/${workflowId}/plans`, {
        params,
      })
      .then((response) => response.data);
  },

  create(payload: FarmWorkflowRequest) {
    return apiClient
      .post<FarmWorkflowResponse>(FARM_WORKFLOW_PATH, payload)
      .then((response) => response.data);
  },

  update(id: number | string, payload: FarmWorkflowRequest) {
    return apiClient
      .put<FarmWorkflowResponse>(`${FARM_WORKFLOW_PATH}/${id}`, payload)
      .then((response) => response.data);
  },

  delete(id: number | string) {
    return apiClient.delete(`${FARM_WORKFLOW_PATH}/${id}`).then(() => undefined);
  },
};

export const farmPlanApi = {
  list(params?: FarmPlanQueryParams) {
    return apiClient
      .get<FarmPlanPageResponse>(FARM_PLAN_PATH, { params })
      .then((response) => response.data);
  },

  getById(
    id: number | string,
    params?: Pick<FarmPlanQueryParams, "includeAdHocStages">,
  ) {
    return apiClient
      .get<FarmPlanResponse>(`${FARM_PLAN_PATH}/${id}`, { params })
      .then((response) => response.data);
  },

  create(workflowId: number | string, payload: FarmPlanRequest) {
    return apiClient
      .post<FarmPlanResponse>(`${FARM_WORKFLOW_PATH}/${workflowId}/plans`, payload)
      .then((response) => response.data);
  },

  createAdHocStage(id: number | string, payload: FarmPlanStageRequest) {
    return apiClient
      .post<FarmPlanStageResponse>(`${FARM_PLAN_PATH}/${id}/stages/ad-hoc`, payload)
      .then((response) => response.data);
  },

  update(id: number | string, payload: FarmPlanRequest) {
    return apiClient
      .put<FarmPlanResponse>(`${FARM_PLAN_PATH}/${id}`, payload)
      .then((response) => response.data);
  },

  delete(id: number | string) {
    return apiClient.delete(`${FARM_PLAN_PATH}/${id}`).then(() => undefined);
  },
};
