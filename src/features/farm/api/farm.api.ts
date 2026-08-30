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
  FarmPlantIdentificationResolveLocationResponse,
  PlantIdentificationQueryParams,
  PlantIdentificationResolveLocationQueryParams,
  FarmProductionHealthMetricRequest,
  FarmProductionHealthMetricResponse,
  ProductionHealthMetricScopeQueryParams,
} from "../types/farm.type";
import type { PageResponse } from "../../foundation/types/foundation.type";

const normalizeRegionSubject = (item: any) => {
  const productionSubject = item.productionSubject || item.crop;
  const productionSubjectId =
    item.productionSubjectId || item.cropId || productionSubject?.id || item.id;

  return {
    ...item,
    cropId: item.cropId || productionSubjectId,
    crop: item.crop || productionSubject,
    productionSubjectId,
    productionSubject: productionSubject || item.productionSubject,
  };
};

const normalizePlot = (item: any) => {
  const area = item.area || item.productionArea;

  return {
    ...item,
    area: area
      ? {
          ...area,
          region: area.region || area.productionRegion,
          productionRegion: area.productionRegion || area.region,
        }
      : area,
    productionArea: item.productionArea || area,
  };
};

const normalizeArea = (item: any) => {
  const region = item.region || item.productionRegion;
  const plots = (item.plots || item.productionUnits || []).map(normalizePlot);

  return {
    ...item,
    region: region
      ? {
          ...region,
        }
      : region,
    productionRegion: item.productionRegion || region,
    plots,
    productionUnits: item.productionUnits || plots,
  };
};

const normalizeRegion = (item: any) => {
  const areas = (item.areas || item.productionAreas || []).map(normalizeArea);
  const subjects = (item.crops || item.productionSubjects || []).map(
    normalizeRegionSubject,
  );

  return {
    ...item,
    crops: subjects,
    productionSubjects: item.productionSubjects || subjects,
    areas,
    productionAreas: item.productionAreas || areas,
  };
};

const normalizePlantLocation = (location: any) => {
  if (!location) return location;

  const region = location.region;
  const area = location.area
    ? {
        ...location.area,
        region: location.area.region || location.area.productionRegion,
      }
    : location.area;
  const plot = location.plot
    ? {
        ...location.plot,
        area: location.plot.area
          ? {
              ...location.plot.area,
              region:
                location.plot.area.region ||
                location.plot.area.productionRegion,
            }
          : location.plot.area,
      }
    : location.plot;

  return {
    ...location,
    region: region ? { ...region } : region,
    area,
    plot,
  };
};

const normalizePlantIdentification = (item: any) => {
  const productionZone = item.productionZone || item.cultivationZone;

  return {
    ...item,
    location: normalizePlantLocation(item.location),
    productionZone,
    cultivationZone: item.cultivationZone || productionZone,
  };
};

const normalizePlantIdentificationResolveLocation = (
  item: any,
): FarmPlantIdentificationResolveLocationResponse => ({
  ...item,
  location: normalizePlantLocation(item.location),
});

const normalizeProductionHealthMetric = (item: any) => {
  const location = item.location;
  const area = location?.area
    ? {
        ...location.area,
        region: location.area.region || location.area.productionRegion,
      }
    : location?.area;
  const plot = location?.plot
    ? {
        ...location.plot,
        area: location.plot.area
          ? {
              ...location.plot.area,
              region:
                location.plot.area.region ||
                location.plot.area.productionRegion,
            }
          : location.plot.area,
      }
    : location?.plot;

  return {
    ...item,
    location: location
      ? {
          ...location,
          region: location.region ? { ...location.region } : location.region,
          area,
          plot,
        }
      : location,
  };
};

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
          r.data.content = r.data.content.map((item: any) => {
            const normalized = normalizeRegion(item);
            return {
              ...normalized,
              provinceId: normalized.provinceId || normalized.province,
              districtId: normalized.districtId || normalized.district,
              note: normalized.note || normalized.description,
            };
          });
        }
        return r.data as PageResponse<FarmRegionResponse>;
      }),

  getById: (id: number) =>
    apiClient.get<any>(`${FARM_ENDPOINTS.regions}/${id}`).then((r) => {
      const item = r.data;
      if (!item) return item as FarmRegionResponse;

      const normalized = normalizeRegion(item);
      return {
        ...normalized,
        provinceId: normalized.provinceId || normalized.province,
        districtId: normalized.districtId || normalized.district,
        note: normalized.note || normalized.description,
      } as FarmRegionResponse;
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
          r.data.content = r.data.content.map(normalizeArea);
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
          r.data.content = r.data.content.map(normalizeArea);
        }
        return r.data as PageResponse<FarmAreaResponse>;
      }),

  getById: (id: number) =>
    apiClient.get<any>(`${FARM_ENDPOINTS.areas}/${id}`).then((r) => {
      const item = r.data;
      if (!item) return item as FarmAreaResponse;

      return normalizeArea(item) as FarmAreaResponse;
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
          r.data.content = r.data.content.map(normalizePlot);
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
      .then((r) => {
        if (r.data?.content) {
          r.data.content = r.data.content.map(normalizePlantIdentification);
        }
        return r.data;
      }),

  getById: (id: number) =>
    apiClient
      .get<FarmPlantIdentificationResponse>(
        `${FARM_ENDPOINTS.plantIdentifications}/${id}`,
      )
      .then((r) => normalizePlantIdentification(r.data)),

  create: (data: FarmPlantIdentificationRequest) =>
    apiClient
      .post<FarmPlantIdentificationResponse>(
        FARM_ENDPOINTS.plantIdentifications,
        data,
      )
      .then((r) => normalizePlantIdentification(r.data)),

  update: (id: number, data: FarmPlantIdentificationRequest) =>
    apiClient
      .put<FarmPlantIdentificationResponse>(
        `${FARM_ENDPOINTS.plantIdentifications}/${id}`,
        data,
      )
      .then((r) => normalizePlantIdentification(r.data)),

  resolveLocation: (params: PlantIdentificationResolveLocationQueryParams) =>
    apiClient
      .get<FarmPlantIdentificationResolveLocationResponse>(
        FARM_ENDPOINTS.plantIdentificationResolveLocation,
        { params },
      )
      .then((r) => normalizePlantIdentificationResolveLocation(r.data)),

  delete: (id: number) =>
    apiClient.delete(`${FARM_ENDPOINTS.plantIdentifications}/${id}`),
};

// ─── Production Health Metrics API ──────────────────────────────────────────

export const productionHealthMetricsApi = {
  listWorkspace: () =>
    apiClient
      .get<FarmProductionHealthMetricResponse>(
        FARM_ENDPOINTS.productionHealthMetricsWorkspace,
      )
      .then((r) => normalizeProductionHealthMetric(r.data)),

  getByScope: (params: ProductionHealthMetricScopeQueryParams) =>
    apiClient
      .get<FarmProductionHealthMetricResponse>(
        FARM_ENDPOINTS.productionHealthMetrics,
        {
          params,
        },
      )
      .then((r) => normalizeProductionHealthMetric(r.data)),

  upsert: (data: FarmProductionHealthMetricRequest) =>
    apiClient
      .post<FarmProductionHealthMetricResponse>(
        FARM_ENDPOINTS.productionHealthMetrics,
        data,
      )
      .then((r) => normalizeProductionHealthMetric(r.data)),
};
