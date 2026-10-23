import {
  ADMIN_FOUNDATION_BASE_PATH,
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
  ProductionSubjectGroupQueryParams,
  ProductionSubjectGroupResponse,
  ProductionSubjectGroupRequest,
  ProductionSubjectResponse,
  ProductionSubjectRequest,
  ProductionSubjectVariantQueryParams,
  ProductionSubjectVariantResponse,
  ProductionSubjectVariantRequest,
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
      .get<PageResponse<CatalogRecordResponse>>(
        catalog === "crop-groups"
          ? FOUNDATION_ENDPOINTS.cropGroups
          : catalog === "farming-methods"
            ? FOUNDATION_ENDPOINTS.farmingMethods
            : `${FOUNDATION_BASE_PATH}/${catalog}`,
        {
          params: ["crop-groups", "farming-methods"].includes(catalog)
            ? { ...params, domainCode: "CROP" }
            : params,
        },
      )
      .then((r) => r.data),

  getById: (catalog: CatalogType, id: number) =>
    apiClient
      .get<CatalogRecordResponse>(
        `${
          catalog === "crop-groups"
            ? FOUNDATION_ENDPOINTS.cropGroups
            : catalog === "farming-methods"
              ? FOUNDATION_ENDPOINTS.farmingMethods
              : `${FOUNDATION_BASE_PATH}/${catalog}`
        }/${id}`,
      )
      .then((r) => r.data),

  create: (catalog: CatalogType, data: CatalogRecordRequest) =>
    apiClient
      .post<CatalogRecordResponse>(
        catalog === "crop-groups"
          ? FOUNDATION_ENDPOINTS.adminCropGroups
          : catalog === "farming-methods"
            ? FOUNDATION_ENDPOINTS.adminFarmingMethods
            : `${ADMIN_FOUNDATION_BASE_PATH}/${catalog}`,
        data,
      )
      .then((r) => r.data),

  update: (catalog: CatalogType, id: number, data: CatalogRecordRequest) =>
    apiClient
      .put<CatalogRecordResponse>(
        `${
          catalog === "crop-groups"
            ? FOUNDATION_ENDPOINTS.adminCropGroups
            : catalog === "farming-methods"
              ? FOUNDATION_ENDPOINTS.adminFarmingMethods
              : `${ADMIN_FOUNDATION_BASE_PATH}/${catalog}`
        }/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (catalog: CatalogType, id: number) =>
    apiClient.delete(
      `${
        catalog === "crop-groups"
          ? FOUNDATION_ENDPOINTS.adminCropGroups
          : catalog === "farming-methods"
            ? FOUNDATION_ENDPOINTS.adminFarmingMethods
            : `${ADMIN_FOUNDATION_BASE_PATH}/${catalog}`
      }/${id}`,
    ),
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
      .post<FoundationCropResponse>(FOUNDATION_ENDPOINTS.adminCrops, data)
      .then((r) => r.data),

  update: (id: number, data: FoundationCropRequest) =>
    apiClient
      .put<FoundationCropResponse>(
        `${FOUNDATION_ENDPOINTS.adminCrops}/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`${FOUNDATION_ENDPOINTS.adminCrops}/${id}`),
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
        FOUNDATION_ENDPOINTS.adminCropVarieties,
        data,
      )
      .then((r) => r.data),

  update: (id: number, data: FoundationCropVarietyRequest) =>
    apiClient
      .put<FoundationCropVarietyResponse>(
        `${FOUNDATION_ENDPOINTS.adminCropVarieties}/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`${FOUNDATION_ENDPOINTS.adminCropVarieties}/${id}`),
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
        FOUNDATION_ENDPOINTS.adminGrowthCycleTemplates,
        data,
      )
      .then((r) => r.data),

  update: (id: number, data: FoundationGrowthCycleTemplateRequest) =>
    apiClient
      .put<FoundationGrowthCycleTemplateResponse>(
        `${FOUNDATION_ENDPOINTS.adminGrowthCycleTemplates}/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`${FOUNDATION_ENDPOINTS.adminGrowthCycleTemplates}/${id}`),
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
        FOUNDATION_ENDPOINTS.adminFarmingMethodCrops,
        data,
      )
      .then((r) => r.data),

  update: (id: number, data: FarmingMethodCropRequest) =>
    apiClient
      .put<FarmingMethodCropResponse>(
        `${FOUNDATION_ENDPOINTS.adminFarmingMethodCrops}/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`${FOUNDATION_ENDPOINTS.adminFarmingMethodCrops}/${id}`),
};

// ─── Lifecycle Template API ───────────────────────────────────────────────────

export const lifecycleTemplateApi = {
  list: (params?: LifecycleTemplateQueryParams) =>
    apiClient
      .get<
        PageResponse<LifecycleTemplate>
      >(FOUNDATION_ENDPOINTS.lifecycleTemplates, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<LifecycleTemplate>(
        `${FOUNDATION_ENDPOINTS.lifecycleTemplates}/${id}`,
      )
      .then((r) => r.data),

  create: (data: LifecycleTemplate) =>
    apiClient
      .post<LifecycleTemplate>(
        FOUNDATION_ENDPOINTS.adminLifecycleTemplates,
        data,
      )
      .then((r) => r.data),

  update: (id: number, data: LifecycleTemplate) =>
    apiClient
      .put<LifecycleTemplate>(
        `${FOUNDATION_ENDPOINTS.adminLifecycleTemplates}/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`${FOUNDATION_ENDPOINTS.adminLifecycleTemplates}/${id}`),
};

export const userLifecycleTemplateApi = {
  list: (params?: LifecycleTemplateQueryParams) =>
    apiClient
      .get<
        PageResponse<LifecycleTemplate>
      >(FOUNDATION_ENDPOINTS.lifecycleTemplates, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<LifecycleTemplate>(
        `${FOUNDATION_ENDPOINTS.lifecycleTemplates}/${id}`,
      )
      .then((r) => r.data),

  create: (data: LifecycleTemplate) =>
    apiClient
      .post<LifecycleTemplate>(
        FOUNDATION_ENDPOINTS.adminLifecycleTemplates,
        data,
      )
      .then((r) => r.data),

  update: (id: number, data: LifecycleTemplate) =>
    apiClient
      .put<LifecycleTemplate>(
        `${FOUNDATION_ENDPOINTS.adminLifecycleTemplates}/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(
      `${FOUNDATION_ENDPOINTS.adminLifecycleTemplates}/${id}`,
    ),
};

// ─── Production Subjects & Variants API ───────────────────────────────────────
export const productionSubjectApi = {
  // ─── User / Dropdown Endpoints (Public) ───
  list: (params?: ProductionSubjectQueryParams) =>
    apiClient
      .get<
        PageResponse<ProductionSubjectResponse>
      >(FOUNDATION_ENDPOINTS.crops, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<ProductionSubjectResponse>(
        `${FOUNDATION_ENDPOINTS.crops}/${id}`,
      )
      .then((r) => r.data),

  getPublicById: (id: number) =>
    apiClient
      .get<ProductionSubjectResponse>(
        `${FOUNDATION_ENDPOINTS.crops}/${id}`,
      )
      .then((r) => r.data),

  // ─── Admin Foundation Management Endpoints ───
  adminList: (params?: ProductionSubjectQueryParams) =>
    apiClient
      .get<
        PageResponse<ProductionSubjectResponse>
      >(FOUNDATION_ENDPOINTS.adminCrops, { params })
      .then((r) => r.data),

  adminGetById: (id: number) =>
    apiClient
      .get<ProductionSubjectResponse>(
        `${FOUNDATION_ENDPOINTS.adminCrops}/${id}`,
      )
      .then((r) => r.data),

  adminCreate: (data: ProductionSubjectRequest) =>
    apiClient
      .post<ProductionSubjectResponse>(
        FOUNDATION_ENDPOINTS.adminCrops,
        data,
      )
      .then((r) => r.data),

  adminUpdate: (id: number, data: ProductionSubjectRequest) =>
    apiClient
      .put<ProductionSubjectResponse>(
        `${FOUNDATION_ENDPOINTS.adminCrops}/${id}`,
        data,
      )
      .then((r) => r.data),

  adminDelete: (id: number) =>
    apiClient.delete(`${FOUNDATION_ENDPOINTS.adminCrops}/${id}`),
};

export const productionSubjectGroupApi = {
  list: (params: ProductionSubjectGroupQueryParams) =>
    apiClient
      .get<
        PageResponse<ProductionSubjectGroupResponse>
      >(FOUNDATION_ENDPOINTS.cropGroups, { params })
      .then((r) => r.data),

  create: (data: ProductionSubjectGroupRequest) =>
    apiClient
      .post<ProductionSubjectGroupResponse>(
        FOUNDATION_ENDPOINTS.adminCropGroups,
        data,
      )
      .then((r) => r.data),

  update: (id: number, data: ProductionSubjectGroupRequest) =>
    apiClient
      .put<ProductionSubjectGroupResponse>(
        `${FOUNDATION_ENDPOINTS.adminCropGroups}/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient
      .delete<void>(`${FOUNDATION_ENDPOINTS.adminCropGroups}/${id}`)
      .then((r) => r.data),
};

export const productionSubjectVariantApi = {
  // ─── User / Dropdown Endpoints (Public) ───
  list: (params?: ProductionSubjectVariantQueryParams) =>
    apiClient
      .get<
        PageResponse<ProductionSubjectVariantResponse>
      >(FOUNDATION_ENDPOINTS.cropVarieties, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<ProductionSubjectVariantResponse>(
        `${FOUNDATION_ENDPOINTS.cropVarieties}/${id}`,
      )
      .then((r) => r.data),

  getPublicById: (id: number) =>
    apiClient
      .get<ProductionSubjectVariantResponse>(
        `${FOUNDATION_ENDPOINTS.cropVarieties}/${id}`,
      )
      .then((r) => r.data),

  // ─── Admin Foundation Management Endpoints ───
  adminList: (params?: ProductionSubjectVariantQueryParams) =>
    apiClient
      .get<
        PageResponse<ProductionSubjectVariantResponse>
      >(FOUNDATION_ENDPOINTS.adminCropVarieties, { params })
      .then((r) => r.data),

  adminGetById: (id: number) =>
    apiClient
      .get<ProductionSubjectVariantResponse>(
        `${FOUNDATION_ENDPOINTS.adminCropVarieties}/${id}`,
      )
      .then((r) => r.data),

  adminCreate: (data: ProductionSubjectVariantRequest) =>
    apiClient
      .post<ProductionSubjectVariantResponse>(
        FOUNDATION_ENDPOINTS.adminCropVarieties,
        data,
      )
      .then((r) => r.data),

  adminUpdate: (id: number, data: ProductionSubjectVariantRequest) =>
    apiClient
      .put<ProductionSubjectVariantResponse>(
        `${FOUNDATION_ENDPOINTS.adminCropVarieties}/${id}`,
        data,
      )
      .then((r) => r.data),

  adminDelete: (id: number) =>
    apiClient.delete(`${FOUNDATION_ENDPOINTS.adminCropVarieties}/${id}`),
};

export const productionMethodApi = {
  // ─── User / Dropdown Endpoints (Public) ───
  list: (params?: ProductionMethodQueryParams) =>
    apiClient
      .get<
        PageResponse<ProductionMethodResponse>
      >(FOUNDATION_ENDPOINTS.farmingMethods, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<ProductionMethodResponse>(`${FOUNDATION_ENDPOINTS.farmingMethods}/${id}`)
      .then((r) => r.data),

  // ─── Admin Foundation Management Endpoints ───
  create: (data: ProductionMethodRequest) =>
    apiClient
      .post<ProductionMethodResponse>(
        FOUNDATION_ENDPOINTS.adminFarmingMethods,
        data,
      )
      .then((r) => r.data),

  update: (id: number, data: ProductionMethodRequest) =>
    apiClient
      .put<ProductionMethodResponse>(
        `${FOUNDATION_ENDPOINTS.adminFarmingMethods}/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`${FOUNDATION_ENDPOINTS.adminFarmingMethods}/${id}`),
};

export const methodApplicationApi = {
  list: (params?: MethodApplicationQueryParams) =>
    apiClient
      .get<
        PageResponse<MethodApplication>
      >(FOUNDATION_ENDPOINTS.farmingMethodCrops, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<MethodApplication>(
        `${FOUNDATION_ENDPOINTS.farmingMethodCrops}/${id}`,
      )
      .then((r) => r.data),

  create: (data: MethodApplication) =>
    apiClient
      .post<MethodApplication>(
        FOUNDATION_ENDPOINTS.adminFarmingMethodCrops,
        data,
      )
      .then((r) => r.data),

  update: (id: number, data: MethodApplication) =>
    apiClient
      .put<MethodApplication>(
        `${FOUNDATION_ENDPOINTS.adminFarmingMethodCrops}/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(
      `${FOUNDATION_ENDPOINTS.adminFarmingMethodCrops}/${id}`,
    ),
};
