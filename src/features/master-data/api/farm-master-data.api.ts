import { apiClient } from "../../../shared/lib/axios";
import type {
  FarmBaseQueryParams,
  FarmPageResponse,
  FarmDepartmentRequest,
  FarmDepartmentDeleteResponse,
  FarmDepartmentResponse,
  DepartmentOptionResponse,
  MasterDepartmentResponse,
  FarmPositionRequest,
  FarmPositionResponse,
  PositionOptionResponse,
  MasterPositionResponse,
  FarmPositionResponsibilityRequest,
  FarmPositionResponsibilityResponse,
  PositionResponsibilityQueryParams,
  FarmTeamRequest,
  FarmTeamResponse,
  FarmPersonnelQueryParams,
  FarmPersonnelRequest,
  FarmPersonnelResponse,
} from "../types/farm-master-data.type";

const BASE = "/api/farm";

// Helpers for Workspace Header
const getHeaders = (workspaceId?: number) => {
  return workspaceId ? { "X-Workspace-Id": workspaceId } : {};
};

// ─── Farm Departments API ─────────────────────────────────────────────────────

export const farmDepartmentApi = {
  list: (params?: FarmBaseQueryParams, workspaceId?: number) =>
    apiClient
      .get<FarmPageResponse<FarmDepartmentResponse>>(`${BASE}/departments`, {
        params,
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  getById: (id: number, workspaceId?: number) =>
    apiClient
      .get<FarmDepartmentResponse>(`${BASE}/departments/${id}`, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  create: (data: FarmDepartmentRequest, workspaceId?: number) =>
    apiClient
      .post<FarmDepartmentResponse>(`${BASE}/departments`, data, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  update: (id: number, data: FarmDepartmentRequest, workspaceId?: number) =>
    apiClient
      .put<FarmDepartmentResponse>(`${BASE}/departments/${id}`, data, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  delete: (id: number, workspaceId?: number): Promise<FarmDepartmentDeleteResponse> =>
    apiClient.delete(`${BASE}/departments/${id}`, {
      headers: getHeaders(workspaceId),
    }).then(() => undefined),

  options: (params?: { page?: number; size?: number }, workspaceId?: number) =>
    apiClient
      .get<FarmPageResponse<DepartmentOptionResponse>>(`${BASE}/departments/options`, {
        params,
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  masterData: (
    params?: { used?: boolean; page?: number; size?: number },
    workspaceId?: number,
  ) =>
    apiClient
      .get<FarmPageResponse<MasterDepartmentResponse>>(`${BASE}/departments/master-data`, {
        params,
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),
};

// ─── Farm Positions API ───────────────────────────────────────────────────────

export const farmPositionApi = {
  list: (params?: FarmBaseQueryParams, workspaceId?: number) =>
    apiClient
      .get<FarmPageResponse<FarmPositionResponse>>(`${BASE}/positions`, {
        params,
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  getById: (id: number, workspaceId?: number) =>
    apiClient
      .get<FarmPositionResponse>(`${BASE}/positions/${id}`, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  create: (data: FarmPositionRequest, workspaceId?: number) =>
    apiClient
      .post<FarmPositionResponse>(`${BASE}/positions`, data, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  update: (id: number, data: FarmPositionRequest, workspaceId?: number) =>
    apiClient
      .put<FarmPositionResponse>(`${BASE}/positions/${id}`, data, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  delete: (id: number, workspaceId?: number) =>
    apiClient.delete(`${BASE}/positions/${id}`, {
      headers: getHeaders(workspaceId),
    }),

  options: (params?: { page?: number; size?: number }, workspaceId?: number) =>
    apiClient
      .get<FarmPageResponse<PositionOptionResponse>>(`${BASE}/positions/options`, {
        params,
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  masterData: (
    params?: { used?: boolean; page?: number; size?: number },
    workspaceId?: number,
  ) =>
    apiClient
      .get<FarmPageResponse<MasterPositionResponse>>(`${BASE}/positions/master-data`, {
        params,
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),
};

// ─── Farm Position Responsibilities API ───────────────────────────────────────

export const farmPositionResponsibilityApi = {
  list: (positionId: number, params?: PositionResponsibilityQueryParams) =>
    apiClient
      .get<FarmPositionResponsibilityResponse[]>(
        `${BASE}/positions/${positionId}/responsibilities`,
        { params }
      )
      .then((r) => r.data),

  create: (positionId: number, data: FarmPositionResponsibilityRequest) =>
    apiClient
      .post<FarmPositionResponsibilityResponse>(
        `${BASE}/positions/${positionId}/responsibilities`,
        data
      )
      .then((r) => r.data),

  update: (
    positionId: number,
    responsibilityId: number,
    data: FarmPositionResponsibilityRequest
  ) =>
    apiClient
      .put<FarmPositionResponsibilityResponse>(
        `${BASE}/positions/${positionId}/responsibilities/${responsibilityId}`,
        data
      )
      .then((r) => r.data),

  delete: (positionId: number, responsibilityId: number) =>
    apiClient.delete(
      `${BASE}/positions/${positionId}/responsibilities/${responsibilityId}`
    ),
};

// ─── Farm Teams API ───────────────────────────────────────────────────────────

export const farmTeamApi = {
  list: (params?: FarmBaseQueryParams, workspaceId?: number) =>
    apiClient
      .get<FarmPageResponse<FarmTeamResponse>>(`${BASE}/teams`, {
        params,
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  getById: (id: number, workspaceId?: number) =>
    apiClient
      .get<FarmTeamResponse>(`${BASE}/teams/${id}`, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  create: (data: FarmTeamRequest, workspaceId?: number) =>
    apiClient
      .post<FarmTeamResponse>(`${BASE}/teams`, data, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  update: (id: number, data: FarmTeamRequest, workspaceId?: number) =>
    apiClient
      .put<FarmTeamResponse>(`${BASE}/teams/${id}`, data, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  delete: (id: number, workspaceId?: number) =>
    apiClient.delete(`${BASE}/teams/${id}`, {
      headers: getHeaders(workspaceId),
    }),
};

// ─── Farm Personnel API ───────────────────────────────────────────────────────

export const farmPersonnelApi = {
  list: (params?: FarmPersonnelQueryParams, workspaceId?: number) =>
    apiClient
      .get<FarmPageResponse<FarmPersonnelResponse>>(`${BASE}/personnel`, {
        params,
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  getById: (id: number, workspaceId?: number) =>
    apiClient
      .get<FarmPersonnelResponse>(`${BASE}/personnel/${id}`, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  create: (data: FarmPersonnelRequest, workspaceId?: number) =>
    apiClient
      .post<FarmPersonnelResponse>(`${BASE}/personnel`, data, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  update: (id: number, data: FarmPersonnelRequest, workspaceId?: number) =>
    apiClient
      .put<FarmPersonnelResponse>(`${BASE}/personnel/${id}`, data, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  delete: (id: number, workspaceId?: number) =>
    apiClient.delete(`${BASE}/personnel/${id}`, {
      headers: getHeaders(workspaceId),
    }),
};
