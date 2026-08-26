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
    apiClient.post<FarmSeedResponse>(FARM_ENDPOINTS.seeds, data).then((r) => {
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
      .get<PageResponse<any>>(FARM_ENDPOINTS.regions, { params })
      .then((r) => {
        if (r.data?.content) {
          r.data.content = r.data.content.map((item: any) => ({
            ...item,
            provinceId: item.provinceId || item.province,
            districtId: item.districtId || item.district,
            note: item.note || item.description,
            areas: item.areas || item.productionAreas?.map((area: any) => ({
              ...area,
              region: area.region || area.productionRegion,
              plots: area.plots || area.productionUnits?.map((unit: any) => ({
                ...unit,
                area: unit.area || unit.productionArea
              }))
            }))
          }));
        }
        return r.data as PageResponse<FarmRegionResponse>;
      }),

  getById: (id: number) =>
    apiClient.get<any>(`${FARM_ENDPOINTS.regions}/${id}`).then((r) => {
      const item = r.data;
      if (item) {
        item.provinceId = item.provinceId || item.province;
        item.districtId = item.districtId || item.district;
        item.note = item.note || item.description;
        if (item.productionAreas) {
          item.areas = item.productionAreas.map((area: any) => ({
            ...area,
            region: area.region || area.productionRegion,
            plots: area.plots || area.productionUnits?.map((unit: any) => ({
              ...unit,
              area: unit.area || unit.productionArea
            }))
          }));
        }
      }
      return item as FarmRegionResponse;
    }),

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
        PageResponse<any>
      >(`${FARM_ENDPOINTS.regions}/${regionId}/production-areas`, { params })
      .then((r) => {
        if (r.data?.content) {
          r.data.content = r.data.content.map((item: any) => ({
            ...item,
            region: item.region || item.productionRegion,
            plots: item.plots || item.productionUnits,
          }));
        }
        return r.data as PageResponse<FarmAreaResponse>;
      }),
};

// ─── Area API ─────────────────────────────────────────────────────────────────

export const areaApi = {
  list: (params?: AreaQueryParams) =>
    apiClient
      .get<PageResponse<any>>(FARM_ENDPOINTS.areas, { params })
      .then((r) => {
        if (r.data?.content) {
          r.data.content = r.data.content.map((item: any) => ({
            ...item,
            region: item.region || item.productionRegion,
            plots: item.plots || item.productionUnits,
          }));
        }
        return r.data as PageResponse<FarmAreaResponse>;
      }),

  getById: (id: number) =>
    apiClient.get<any>(`${FARM_ENDPOINTS.areas}/${id}`).then((r) => {
      const item = r.data;
      if (item) {
        item.region = item.region || item.productionRegion;
        item.plots = item.plots || item.productionUnits;
      }
      return item as FarmAreaResponse;
    }),

  create: (regionId: number, data: FarmAreaRequest) =>
    apiClient
      .post<FarmAreaResponse>(
        `${FARM_ENDPOINTS.regions}/${regionId}/production-areas`,
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
        PageResponse<any>
      >(`${FARM_ENDPOINTS.areas}/${areaId}/production-units`, { params })
      .then((r) => {
        if (r.data?.content) {
          r.data.content = r.data.content.map((item: any) => ({
            ...item,
            area: item.area || item.productionArea,
          }));
        }
        return r.data as PageResponse<FarmPlotResponse>;
      }),
};

// ─── Plot API ─────────────────────────────────────────────────────────────────

/**
 * The plot endpoint returns its parent area as `productionArea`, whose parent
 * region is named `productionRegion`. Normalize that nested shape so screens
 * can consistently read `plot.area.region`.
 */
const normalizePlot = (item: any) => {
  const area = item.area || item.productionArea;

  return {
    ...item,
    area: area
      ? {
          ...area,
          region: area.region || area.productionRegion,
        }
      : area,
  };
};

export const plotApi = {
  list: (params?: PlotQueryParams) =>
    apiClient
      .get<PageResponse<any>>(FARM_ENDPOINTS.plots, { params })
      .then((r) => {
        if (r.data?.content) {
          r.data.content = r.data.content.map(normalizePlot);
        }
        return r.data as PageResponse<FarmPlotResponse>;
      }),

  getById: (id: number) =>
    apiClient.get<any>(`${FARM_ENDPOINTS.plots}/${id}`).then((r) => {
      const item = r.data;
      if (item) {
        return normalizePlot(item) as FarmPlotResponse;
      }
      return item as FarmPlotResponse;
    }),

  create: (areaId: number, data: FarmPlotRequest) =>
    apiClient
      .post<FarmPlotResponse>(
        `${FARM_ENDPOINTS.areas}/${areaId}/production-units`,
        data,
      )
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
      .get<
        PageResponse<FarmCultivationZoneResponse>
      >(FARM_ENDPOINTS.cultivationZones, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<FarmCultivationZoneResponse>(
        `${FARM_ENDPOINTS.cultivationZones}/${id}`,
      )
      .then((r) => r.data),

  create: (data: FarmCultivationZoneRequest) =>
    apiClient
      .post<FarmCultivationZoneResponse>(FARM_ENDPOINTS.cultivationZones, data)
      .then((r) => r.data),

  update: (id: number, data: FarmCultivationZoneRequest) =>
    apiClient
      .put<FarmCultivationZoneResponse>(
        `${FARM_ENDPOINTS.cultivationZones}/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`${FARM_ENDPOINTS.cultivationZones}/${id}`),
};

// ─── Plant Identification API ────────────────────────────────────────────────

export const plantIdentificationApi = {
  list: (params?: PlantIdentificationQueryParams) =>
    apiClient
      .get<
        PageResponse<FarmPlantIdentificationResponse>
      >(FARM_ENDPOINTS.plantIdentifications, { params })
      .then((r) => r.data),

  getById: (id: number) =>
    apiClient
      .get<FarmPlantIdentificationResponse>(
        `${FARM_ENDPOINTS.plantIdentifications}/${id}`,
      )
      .then((r) => r.data),

  create: (data: FarmPlantIdentificationRequest) =>
    apiClient
      .post<FarmPlantIdentificationResponse>(
        FARM_ENDPOINTS.plantIdentifications,
        data,
      )
      .then((r) => r.data),

  update: (id: number, data: FarmPlantIdentificationRequest) =>
    apiClient
      .put<FarmPlantIdentificationResponse>(
        `${FARM_ENDPOINTS.plantIdentifications}/${id}`,
        data,
      )
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`${FARM_ENDPOINTS.plantIdentifications}/${id}`),
};
