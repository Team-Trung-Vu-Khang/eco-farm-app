import { FARM_ENDPOINTS } from "@/shared/constants/farm.constants";
import { apiClient } from "../../../shared/lib/axios";
import type {
  FarmSeedRequest,
  FarmSeedResponse,
  SeedQueryParams,
  FarmRegionRequest,
  FarmRegionResponse,
  RegionQueryParams,
  FarmAreaRequest,
  FarmAreaResponse,
  AreaQueryParams,
  FarmPlotRequest,
  FarmPlotResponse,
  PlotQueryParams,
  FarmCultivationZoneRequest,
  FarmCultivationZoneResponse,
  CultivationZoneQueryParams,
  FarmPlantIdentificationRequest,
  FarmPlantIdentificationResponse,
  PlantIdentificationQueryParams,
} from "../types/farm.type";
import type { PageResponse } from "../../foundation/types/foundation.type";

// ─── Seed API ─────────────────────────────────────────────────────────────────

export const seedApi = {
  list: (params?: SeedQueryParams) =>
    apiClient
      .get<PageResponse<FarmSeedResponse>>(FARM_ENDPOINTS.seeds, { params })
      .then((r) => {
        if (r.data?.content) {
          r.data.content = r.data.content.map((item) => ({
            ...item,
            cropVariety: item.cropVariety || item.subjectVariant,
            crop: item.crop || item.productionSubject,
          }));
        }
        return r.data;
      }),

  getById: (id: number) =>
    apiClient
      .get<FarmSeedResponse>(`${FARM_ENDPOINTS.seeds}/${id}`)
      .then((r) => {
        const item = r.data;
        if (item) {
          item.cropVariety = item.cropVariety || item.subjectVariant;
          item.crop = item.crop || item.productionSubject;
        }
        return item;
      }),

  create: (data: FarmSeedRequest) =>
    apiClient
      .post<FarmSeedResponse>(FARM_ENDPOINTS.seeds, data)
      .then((r) => {
        const item = r.data;
        if (item) {
          item.cropVariety = item.cropVariety || item.subjectVariant;
          item.crop = item.crop || item.productionSubject;
        }
        return item;
      }),

  update: (id: number, data: FarmSeedRequest) =>
    apiClient
      .put<FarmSeedResponse>(`${FARM_ENDPOINTS.seeds}/${id}`, data)
      .then((r) => {
        const item = r.data;
        if (item) {
          item.cropVariety = item.cropVariety || item.subjectVariant;
          item.crop = item.crop || item.productionSubject;
        }
        return item;
      }),

  delete: (id: number) => apiClient.delete(`${FARM_ENDPOINTS.seeds}/${id}`),
};

// ─── Region API ───────────────────────────────────────────────────────────────

export const regionApi = {
  list: (params?: RegionQueryParams) =>
    apiClient
      .get<PageResponse<FarmRegionResponse>>(FARM_ENDPOINTS.regions, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<FarmRegionResponse>(`${FARM_ENDPOINTS.regions}/${id}`)
      .then((r) => r.data),

  create: (data: FarmRegionRequest) =>
    apiClient
      .post<FarmRegionResponse>(FARM_ENDPOINTS.regions, data)
      .then((r) => r.data),

  update: (id: number, data: FarmRegionRequest) =>
    apiClient
      .put<FarmRegionResponse>(`${FARM_ENDPOINTS.regions}/${id}`, data)
      .then((r) => r.data),

  delete: (id: number) => apiClient.delete(`${FARM_ENDPOINTS.regions}/${id}`),

  getAreasByRegionId: (regionId: number, params?: AreaQueryParams) =>
    apiClient
      .get<
        PageResponse<FarmAreaResponse>
      >(`${FARM_ENDPOINTS.regions}/${regionId}/areas`, { params })
      .then((r) => r.data),
};

// ─── Area API ─────────────────────────────────────────────────────────────────

export const areaApi = {
  list: (params?: AreaQueryParams) =>
    apiClient
      .get<PageResponse<FarmAreaResponse>>(FARM_ENDPOINTS.areas, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<FarmAreaResponse>(`${FARM_ENDPOINTS.areas}/${id}`)
      .then((r) => r.data),

  create: (regionId: number, data: FarmAreaRequest) =>
    apiClient
      .post<FarmAreaResponse>(
        `${FARM_ENDPOINTS.regions}/${regionId}/areas`,
        data,
      )
      .then((r) => r.data),

  update: (id: number, data: FarmAreaRequest) =>
    apiClient
      .put<FarmAreaResponse>(`${FARM_ENDPOINTS.areas}/${id}`, data)
      .then((r) => r.data),

  delete: (id: number) => apiClient.delete(`${FARM_ENDPOINTS.areas}/${id}`),

  getPlotsByAreaId: (areaId: number, params?: PlotQueryParams) =>
    apiClient
      .get<
        PageResponse<FarmPlotResponse>
      >(`${FARM_ENDPOINTS.areas}/${areaId}/plots`, { params })
      .then((r) => r.data),
};

// ─── Plot API ─────────────────────────────────────────────────────────────────

export const plotApi = {
  list: (params?: PlotQueryParams) =>
    apiClient
      .get<PageResponse<FarmPlotResponse>>(FARM_ENDPOINTS.plots, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<FarmPlotResponse>(`${FARM_ENDPOINTS.plots}/${id}`)
      .then((r) => r.data),

  create: (areaId: number, data: FarmPlotRequest) =>
    apiClient
      .post<FarmPlotResponse>(`${FARM_ENDPOINTS.areas}/${areaId}/plots`, data)
      .then((r) => r.data),

  update: (id: number, data: FarmPlotRequest) =>
    apiClient
      .put<FarmPlotResponse>(`${FARM_ENDPOINTS.plots}/${id}`, data)
      .then((r) => r.data),

  delete: (id: number) => apiClient.delete(`${FARM_ENDPOINTS.plots}/${id}`),
};

// ─── Cultivation Zone API ──────────────────────────────────────────────────────────────────

export const cultivationZoneApi = {
  list: (params?: CultivationZoneQueryParams) =>
    apiClient
      .get<PageResponse<FarmCultivationZoneResponse>>(FARM_ENDPOINTS.cultivationZones, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<FarmCultivationZoneResponse>(`${FARM_ENDPOINTS.cultivationZones}/${id}`)
      .then((r) => r.data),

  create: (data: FarmCultivationZoneRequest) =>
    apiClient
      .post<FarmCultivationZoneResponse>(FARM_ENDPOINTS.cultivationZones, data)
      .then((r) => r.data),

  update: (id: number, data: FarmCultivationZoneRequest) =>
    apiClient
      .put<FarmCultivationZoneResponse>(`${FARM_ENDPOINTS.cultivationZones}/${id}`, data)
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`${FARM_ENDPOINTS.cultivationZones}/${id}`),
};

// ─── Plant Identification API ────────────────────────────────────────────────

export const plantIdentificationApi = {
  list: (params?: PlantIdentificationQueryParams) =>
    apiClient
      .get<PageResponse<FarmPlantIdentificationResponse>>(FARM_ENDPOINTS.plantIdentifications, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<FarmPlantIdentificationResponse>(`${FARM_ENDPOINTS.plantIdentifications}/${id}`)
      .then((r) => r.data),

  create: (data: FarmPlantIdentificationRequest) =>
    apiClient
      .post<FarmPlantIdentificationResponse>(FARM_ENDPOINTS.plantIdentifications, data)
      .then((r) => r.data),

  update: (id: number, data: FarmPlantIdentificationRequest) =>
    apiClient
      .put<FarmPlantIdentificationResponse>(`${FARM_ENDPOINTS.plantIdentifications}/${id}`, data)
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`${FARM_ENDPOINTS.plantIdentifications}/${id}`),
};

