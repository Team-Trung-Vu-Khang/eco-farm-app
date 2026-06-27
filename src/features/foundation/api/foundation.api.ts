import { apiClient } from "../../../shared/lib/axios";
import type {
  CatalogType,
  CatalogRecordRequest,
  CatalogRecordResponse,
  CatalogQueryParams,
  FoundationCropRequest,
  FoundationCropResponse,
  CropQueryParams,
  FoundationCropVarietyRequest,
  FoundationCropVarietyResponse,
  CropVarietyQueryParams,
  FoundationGrowthCycleTemplateRequest,
  FoundationGrowthCycleTemplateResponse,
  GrowthCycleTemplateQueryParams,
  FarmingMethodCropRequest,
  FarmingMethodCropResponse,
  FarmingMethodCropQueryParams,
  PageResponse,
} from "../types/foundation.type";

const BASE = "/api/foundation";

// ─── Catalog API ──────────────────────────────────────────────────────────────
// Phục vụ 5 catalog types: crop-groups, farming-methods, soil-types,
// terrain-features, terrain-parameters — dùng chung 1 endpoint generic

export const catalogApi = {
  list: (catalog: CatalogType, params?: CatalogQueryParams) =>
    apiClient
      .get<
        PageResponse<CatalogRecordResponse>
      >(`${BASE}/${catalog}`, { params })
      .then((r) => r.data),

  getById: (catalog: CatalogType, id: number) =>
    apiClient
      .get<CatalogRecordResponse>(`${BASE}/${catalog}/${id}`)
      .then((r) => r.data),

  create: (catalog: CatalogType, data: CatalogRecordRequest) =>
    apiClient
      .post<CatalogRecordResponse>(`${BASE}/${catalog}`, data)
      .then((r) => r.data),

  update: (catalog: CatalogType, id: number, data: CatalogRecordRequest) =>
    apiClient
      .put<CatalogRecordResponse>(`${BASE}/${catalog}/${id}`, data)
      .then((r) => r.data),

  delete: (catalog: CatalogType, id: number) =>
    apiClient.delete(`${BASE}/${catalog}/${id}`),
};

// ─── Crop API ─────────────────────────────────────────────────────────────────

export const cropApi = {
  list: (params?: CropQueryParams) =>
    apiClient
      .get<PageResponse<FoundationCropResponse>>(`${BASE}/crops`, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<FoundationCropResponse>(`${BASE}/crops/${id}`)
      .then((r) => r.data),

  create: (data: FoundationCropRequest) =>
    apiClient
      .post<FoundationCropResponse>(`${BASE}/crops`, data)
      .then((r) => r.data),

  update: (id: number, data: FoundationCropRequest) =>
    apiClient
      .put<FoundationCropResponse>(`${BASE}/crops/${id}`, data)
      .then((r) => r.data),

  delete: (id: number) => apiClient.delete(`${BASE}/crops/${id}`),
};

// ─── Crop Variety API ─────────────────────────────────────────────────────────

export const cropVarietyApi = {
  list: (params?: CropVarietyQueryParams) =>
    apiClient
      .get<PageResponse<FoundationCropVarietyResponse>>(
        `${BASE}/crop-varieties`,
        {
          params,
        },
      )
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<FoundationCropVarietyResponse>(`${BASE}/crop-varieties/${id}`)
      .then((r) => r.data),

  create: (data: FoundationCropVarietyRequest) =>
    apiClient
      .post<FoundationCropVarietyResponse>(`${BASE}/crop-varieties`, data)
      .then((r) => r.data),

  update: (id: number, data: FoundationCropVarietyRequest) =>
    apiClient
      .put<FoundationCropVarietyResponse>(`${BASE}/crop-varieties/${id}`, data)
      .then((r) => r.data),

  delete: (id: number) => apiClient.delete(`${BASE}/crop-varieties/${id}`),
};

// ─── Growth Cycle Template API ────────────────────────────────────────────────

export const growthCycleTemplateApi = {
  list: (params?: GrowthCycleTemplateQueryParams) =>
    apiClient
      .get<
        PageResponse<FoundationGrowthCycleTemplateResponse>
      >(`${BASE}/growth-cycle-templates`, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<FoundationGrowthCycleTemplateResponse>(
        `${BASE}/growth-cycle-templates/${id}`,
      )
      .then((r) => r.data),

  create: (data: FoundationGrowthCycleTemplateRequest) =>
    apiClient
      .post<FoundationGrowthCycleTemplateResponse>(
        `${BASE}/growth-cycle-templates`,
        data,
      )
      .then((r) => r.data),

  update: (id: number, data: FoundationGrowthCycleTemplateRequest) =>
    apiClient
      .put<FoundationGrowthCycleTemplateResponse>(
        `${BASE}/growth-cycle-templates/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`${BASE}/growth-cycle-templates/${id}`),
};

// ─── Farming Method Crop API ──────────────────────────────────────────────────

export const farmingMethodCropApi = {
  list: (params?: FarmingMethodCropQueryParams) =>
    apiClient
      .get<
        PageResponse<FarmingMethodCropResponse>
      >(`${BASE}/farming-method-crops`, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<FarmingMethodCropResponse>(`${BASE}/farming-method-crops/${id}`)
      .then((r) => r.data),

  create: (data: FarmingMethodCropRequest) =>
    apiClient
      .post<FarmingMethodCropResponse>(`${BASE}/farming-method-crops`, data)
      .then((r) => r.data),

  update: (id: number, data: FarmingMethodCropRequest) =>
    apiClient
      .put<FarmingMethodCropResponse>(
        `${BASE}/farming-method-crops/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`${BASE}/farming-method-crops/${id}`),
};
