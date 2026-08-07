import {
  FOUNDATION_BASE_PATH,
  FOUNDATION_ENDPOINTS,
} from "@/shared/constants/foundation.constants";
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
  LifecycleTemplate,
  LifecycleTemplateQueryParams,
  ProductionSubjectQueryParams,
  ProductionSubjectResponse,
  ProductionSubjectVariantQueryParams,
  ProductionSubjectVariantResponse,
  ProductionMethodQueryParams,
  ProductionMethodResponse,
  ProductionMethodRequest,
  MethodApplication,
  MethodApplicationQueryParams,
} from "../types/foundation.type";
import { apiClient } from "@/shared/lib/axios";

// ─── Catalog API ──────────────────────────────────────────────────────────────
// Phục vụ 5 catalog types: crop-groups, farming-methods, soil-types,
// terrain-features, terrain-parameters — dùng chung 1 endpoint generic

export const catalogApi = {
  list: (catalog: CatalogType, params?: CatalogQueryParams) =>
    apiClient
      .get<
        PageResponse<CatalogRecordResponse>
      >(`${FOUNDATION_BASE_PATH}/${catalog}`, { params })
      .then((r) => r.data),

  getById: (catalog: CatalogType, id: number) =>
    apiClient
      .get<CatalogRecordResponse>(`${FOUNDATION_BASE_PATH}/${catalog}/${id}`)
      .then((r) => r.data),

  create: (catalog: CatalogType, data: CatalogRecordRequest) =>
    apiClient
      .post<CatalogRecordResponse>(`${FOUNDATION_BASE_PATH}/${catalog}`, data)
      .then((r) => r.data),

  update: (catalog: CatalogType, id: number, data: CatalogRecordRequest) =>
    apiClient
      .put<CatalogRecordResponse>(
        `${FOUNDATION_BASE_PATH}/${catalog}/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (catalog: CatalogType, id: number) =>
    apiClient.delete(`${FOUNDATION_BASE_PATH}/${catalog}/${id}`),
};

// ─── Crop API ─────────────────────────────────────────────────────────────────

export const cropApi = {
  list: (params?: CropQueryParams) =>
    apiClient
      .get<
        PageResponse<FoundationCropResponse>
      >(FOUNDATION_ENDPOINTS.crops, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<FoundationCropResponse>(`${FOUNDATION_ENDPOINTS.crops}/${id}`)
      .then((r) => r.data),

  create: (data: FoundationCropRequest) =>
    apiClient
      .post<FoundationCropResponse>(FOUNDATION_ENDPOINTS.crops, data)
      .then((r) => r.data),

  update: (id: number, data: FoundationCropRequest) =>
    apiClient
      .put<FoundationCropResponse>(`${FOUNDATION_ENDPOINTS.crops}/${id}`, data)
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`${FOUNDATION_ENDPOINTS.crops}/${id}`),
};

// ─── Crop Variety API ─────────────────────────────────────────────────────────

export const cropVarietyApi = {
  list: (params?: CropVarietyQueryParams) =>
    apiClient
      .get<PageResponse<FoundationCropVarietyResponse>>(
        FOUNDATION_ENDPOINTS.cropVarieties,
        {
          params,
        },
      )
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<FoundationCropVarietyResponse>(
        `${FOUNDATION_ENDPOINTS.cropVarieties}/${id}`,
      )
      .then((r) => r.data),

  create: (data: FoundationCropVarietyRequest) =>
    apiClient
      .post<FoundationCropVarietyResponse>(
        FOUNDATION_ENDPOINTS.cropVarieties,
        data,
      )
      .then((r) => r.data),

  update: (id: number, data: FoundationCropVarietyRequest) =>
    apiClient
      .put<FoundationCropVarietyResponse>(
        `${FOUNDATION_ENDPOINTS.cropVarieties}/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`${FOUNDATION_ENDPOINTS.cropVarieties}/${id}`),
};

// ─── Growth Cycle Template API ────────────────────────────────────────────────

export const growthCycleTemplateApi = {
  list: (params?: GrowthCycleTemplateQueryParams) =>
    apiClient
      .get<
        PageResponse<FoundationGrowthCycleTemplateResponse>
      >(FOUNDATION_ENDPOINTS.growthCycleTemplates, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<FoundationGrowthCycleTemplateResponse>(
        `${FOUNDATION_ENDPOINTS.growthCycleTemplates}/${id}`,
      )
      .then((r) => r.data),

  create: (data: FoundationGrowthCycleTemplateRequest) =>
    apiClient
      .post<FoundationGrowthCycleTemplateResponse>(
        FOUNDATION_ENDPOINTS.growthCycleTemplates,
        data,
      )
      .then((r) => r.data),

  update: (id: number, data: FoundationGrowthCycleTemplateRequest) =>
    apiClient
      .put<FoundationGrowthCycleTemplateResponse>(
        `${FOUNDATION_ENDPOINTS.growthCycleTemplates}/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`${FOUNDATION_ENDPOINTS.growthCycleTemplates}/${id}`),
};

// ─── Farming Method Crop API ──────────────────────────────────────────────────

export const farmingMethodCropApi = {
  list: (params?: FarmingMethodCropQueryParams) =>
    apiClient
      .get<
        PageResponse<FarmingMethodCropResponse>
      >(FOUNDATION_ENDPOINTS.farmingMethodCrops, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<FarmingMethodCropResponse>(
        `${FOUNDATION_ENDPOINTS.farmingMethodCrops}/${id}`,
      )
      .then((r) => r.data),

  create: (data: FarmingMethodCropRequest) =>
    apiClient
      .post<FarmingMethodCropResponse>(
        FOUNDATION_ENDPOINTS.farmingMethodCrops,
        data,
      )
      .then((r) => r.data),

  update: (id: number, data: FarmingMethodCropRequest) =>
    apiClient
      .put<FarmingMethodCropResponse>(
        `${FOUNDATION_ENDPOINTS.farmingMethodCrops}/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`${FOUNDATION_ENDPOINTS.farmingMethodCrops}/${id}`),
};

// ─── Lifecycle Template API ───────────────────────────────────────────────────

export const lifecycleTemplateApi = {
  list: (params?: LifecycleTemplateQueryParams) =>
    apiClient
      .get<PageResponse<LifecycleTemplate>>(FOUNDATION_ENDPOINTS.lifecycleTemplates, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<LifecycleTemplate>(`${FOUNDATION_ENDPOINTS.lifecycleTemplates}/${id}`)
      .then((r) => r.data),

  create: (data: LifecycleTemplate) =>
    apiClient
      .post<LifecycleTemplate>(FOUNDATION_ENDPOINTS.lifecycleTemplates, data)
      .then((r) => r.data),

  update: (id: number, data: LifecycleTemplate) =>
    apiClient
      .put<LifecycleTemplate>(`${FOUNDATION_ENDPOINTS.lifecycleTemplates}/${id}`, data)
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`${FOUNDATION_ENDPOINTS.lifecycleTemplates}/${id}`),
};

export const userLifecycleTemplateApi = {
  list: (params?: LifecycleTemplateQueryParams) =>
    apiClient
      .get<PageResponse<LifecycleTemplate>>("/api/foundation/production/lifecycle-templates", { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<LifecycleTemplate>(`/api/foundation/production/lifecycle-templates/${id}`)
      .then((r) => r.data),

  create: (data: LifecycleTemplate) =>
    apiClient
      .post<LifecycleTemplate>("/api/foundation/production/lifecycle-templates", data)
      .then((r) => r.data),

  update: (id: number, data: LifecycleTemplate) =>
    apiClient
      .put<LifecycleTemplate>(`/api/foundation/production/lifecycle-templates/${id}`, data)
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`/api/foundation/production/lifecycle-templates/${id}`),
};

// ─── Production Subjects & Variants API ───────────────────────────────────────
export const productionSubjectApi = {
  list: (params?: ProductionSubjectQueryParams) =>
    apiClient
      .get<PageResponse<ProductionSubjectResponse>>(
        "/api/admin/foundation/production/subjects",
        { params },
      )
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<ProductionSubjectResponse>(
        `/api/admin/foundation/production/subjects/${id}`,
      )
      .then((r) => r.data),
};

export const productionSubjectVariantApi = {
  list: (params?: ProductionSubjectVariantQueryParams) =>
    apiClient
      .get<PageResponse<ProductionSubjectVariantResponse>>(
        "/api/admin/foundation/production/subject-variants",
        { params },
      )
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<ProductionSubjectVariantResponse>(
        `/api/admin/foundation/production/subject-variants/${id}`,
      )
      .then((r) => r.data),
};

export const productionMethodApi = {
  list: (params?: ProductionMethodQueryParams) =>
    apiClient
      .get<PageResponse<ProductionMethodResponse>>(
        "/api/admin/foundation/production/methods",
        { params },
      )
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<ProductionMethodResponse>(
        `/api/admin/foundation/production/methods/${id}`,
      )
      .then((r) => r.data),

  create: (data: ProductionMethodRequest) =>
    apiClient
      .post<ProductionMethodResponse>(
        "/api/admin/foundation/production/methods",
        data,
      )
      .then((r) => r.data),

  update: (id: number, data: ProductionMethodRequest) =>
    apiClient
      .put<ProductionMethodResponse>(
        `/api/admin/foundation/production/methods/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`/api/admin/foundation/production/methods/${id}`),
};

export const methodApplicationApi = {
  list: (params?: MethodApplicationQueryParams) =>
    apiClient
      .get<PageResponse<MethodApplication>>(
        `${FOUNDATION_BASE_PATH}/production/method-applications`,
        { params },
      )
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<MethodApplication>(
        `${FOUNDATION_BASE_PATH}/production/method-applications/${id}`,
      )
      .then((r) => r.data),

  create: (data: MethodApplication) =>
    apiClient
      .post<MethodApplication>(
        `${FOUNDATION_BASE_PATH}/production/method-applications`,
        data,
      )
      .then((r) => r.data),

  update: (id: number, data: MethodApplication) =>
    apiClient
      .put<MethodApplication>(
        `${FOUNDATION_BASE_PATH}/production/method-applications/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`${FOUNDATION_BASE_PATH}/production/method-applications/${id}`),
};


