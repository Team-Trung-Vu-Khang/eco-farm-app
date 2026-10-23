import { apiClient } from "@/shared/lib/axios";
import { FARM_ENDPOINTS } from "@/shared/constants";
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
  AdminFarmPersonnelQueryParams,
  FarmPersonnelRequest,
  FarmPersonnelResponse,
} from "../types/farm-master-data.type";


const getHeaders = (workspaceId?: number) => {
  return workspaceId
    ? { "X-Workspace-Id": workspaceId }
    : { skipWorkspaceHeader: "true" };
};

// ─── Farm Departments API ─────────────────────────────────────────────────────

export const farmDepartmentApi = {
  list: (params?: FarmBaseQueryParams, workspaceId?: number) =>
    apiClient
      .get<FarmPageResponse<FarmDepartmentResponse>>(`${FARM_ENDPOINTS.departments}`, {
        params,
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  getById: (id: number, workspaceId?: number) =>
    apiClient
      .get<FarmDepartmentResponse>(`${FARM_ENDPOINTS.departments}/${id}`, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  create: (data: FarmDepartmentRequest, workspaceId?: number) =>
    apiClient
      .post<FarmDepartmentResponse>(`${FARM_ENDPOINTS.departments}`, data, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  update: (id: number, data: FarmDepartmentRequest, workspaceId?: number) =>
    apiClient
      .put<FarmDepartmentResponse>(`${FARM_ENDPOINTS.departments}/${id}`, data, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  delete: (id: number, workspaceId?: number): Promise<FarmDepartmentDeleteResponse> =>
    apiClient.delete(`${FARM_ENDPOINTS.departments}/${id}`, {
      headers: getHeaders(workspaceId),
    }).then(() => undefined),

  options: (
    params?: { onlyOwner?: boolean; page?: number; size?: number },
    workspaceId?: number,
  ) =>
    apiClient
      .get<FarmPageResponse<DepartmentOptionResponse>>(`${FARM_ENDPOINTS.departments}/options`, {
        params,
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  masterData: (
    params?: { keyword?: string; used?: boolean; page?: number; size?: number },
    workspaceId?: number,
  ) =>
    apiClient
      .get<FarmPageResponse<MasterDepartmentResponse>>(`${FARM_ENDPOINTS.departments}/master-data`, {
        params,
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),
};

// ─── Farm Positions API ───────────────────────────────────────────────────────

export const farmPositionApi = {
  list: (params?: FarmBaseQueryParams, workspaceId?: number) =>
    apiClient
      .get<FarmPageResponse<FarmPositionResponse>>(`${FARM_ENDPOINTS.positions}`, {
        params,
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  getById: (id: number, workspaceId?: number) =>
    apiClient
      .get<FarmPositionResponse>(`${FARM_ENDPOINTS.positions}/${id}`, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  create: (data: FarmPositionRequest, workspaceId?: number) =>
    apiClient
      .post<FarmPositionResponse>(`${FARM_ENDPOINTS.positions}`, data, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  update: (id: number, data: FarmPositionRequest, workspaceId?: number) =>
    apiClient
      .put<FarmPositionResponse>(`${FARM_ENDPOINTS.positions}/${id}`, data, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  delete: (id: number, workspaceId?: number) =>
    apiClient.delete(`${FARM_ENDPOINTS.positions}/${id}`, {
      headers: getHeaders(workspaceId),
    }),

  options: (
    params?: { onlyOwner?: boolean; page?: number; size?: number },
    workspaceId?: number,
  ) =>
    apiClient
      .get<FarmPageResponse<PositionOptionResponse>>(`${FARM_ENDPOINTS.positions}/options`, {
        params,
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  masterData: (
    params?: { keyword?: string; used?: boolean; page?: number; size?: number },
    workspaceId?: number,
  ) =>
    apiClient
      .get<FarmPageResponse<MasterPositionResponse>>(`${FARM_ENDPOINTS.positions}/master-data`, {
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
        `${FARM_ENDPOINTS.positions}/${positionId}/responsibilities`,
        { params }
      )
      .then((r) => r.data),

  create: (positionId: number, data: FarmPositionResponsibilityRequest) =>
    apiClient
      .post<FarmPositionResponsibilityResponse>(
        `${FARM_ENDPOINTS.positions}/${positionId}/responsibilities`,
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
        `${FARM_ENDPOINTS.positions}/${positionId}/responsibilities/${responsibilityId}`,
        data
      )
      .then((r) => r.data),

  delete: (positionId: number, responsibilityId: number) =>
    apiClient.delete(
      `${FARM_ENDPOINTS.positions}/${positionId}/responsibilities/${responsibilityId}`
    ),
};

// ─── Farm Teams API ───────────────────────────────────────────────────────────

export const farmTeamApi = {
  list: (params?: FarmBaseQueryParams, workspaceId?: number) =>
    apiClient
      .get<FarmPageResponse<FarmTeamResponse>>(`${FARM_ENDPOINTS.teams}`, {
        params,
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  getById: (id: number, workspaceId?: number) =>
    apiClient
      .get<FarmTeamResponse>(`${FARM_ENDPOINTS.teams}/${id}`, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  create: (data: FarmTeamRequest, workspaceId?: number) =>
    apiClient
      .post<FarmTeamResponse>(`${FARM_ENDPOINTS.teams}`, data, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  update: (id: number, data: FarmTeamRequest, workspaceId?: number) =>
    apiClient
      .put<FarmTeamResponse>(`${FARM_ENDPOINTS.teams}/${id}`, data, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  delete: (id: number, workspaceId?: number) =>
    apiClient.delete(`${FARM_ENDPOINTS.teams}/${id}`, {
      headers: getHeaders(workspaceId),
    }),
};

// ─── Farm Personnel API ───────────────────────────────────────────────────────

export const farmPersonnelApi = {
  list: (params?: FarmPersonnelQueryParams, workspaceId?: number) =>
    apiClient
      .get<FarmPageResponse<FarmPersonnelResponse>>(`${FARM_ENDPOINTS.personnel}`, {
        params,
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  /** GET /api/admin/farm/personnel (MEVI_ADMIN / MEVI_FARM_ADMIN / MEVI_SUPER_ADMIN) */
  listAdmin: (params: AdminFarmPersonnelQueryParams) =>
    apiClient
      .get<FarmPageResponse<FarmPersonnelResponse>>(FARM_ENDPOINTS.adminPersonnel, {
        params,
        headers: { skipWorkspaceHeader: "true" },
      })
      .then((r) => r.data),

  getById: (id: number, workspaceId?: number) =>
    apiClient
      .get<FarmPersonnelResponse>(`${FARM_ENDPOINTS.personnel}/${id}`, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  create: (data: FarmPersonnelRequest, workspaceId?: number) =>
    apiClient
      .post<FarmPersonnelResponse>(`${FARM_ENDPOINTS.personnel}`, data, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  update: (id: number, data: FarmPersonnelRequest, workspaceId?: number) =>
    apiClient
      .put<FarmPersonnelResponse>(`${FARM_ENDPOINTS.personnel}/${id}`, data, {
        headers: getHeaders(workspaceId),
      })
      .then((r) => r.data),

  delete: (id: number, workspaceId?: number) =>
    apiClient.delete(`${FARM_ENDPOINTS.personnel}/${id}`, {
      headers: getHeaders(workspaceId),
    }),
};
