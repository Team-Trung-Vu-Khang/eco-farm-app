export const FARM_BASE_PATH = "/api/farm";

export const FARM_ENDPOINTS = {
  seeds: `${FARM_BASE_PATH}/seeds`,
  regions: `${FARM_BASE_PATH}/regions`,
  areas: `${FARM_BASE_PATH}/areas`,
  plots: `${FARM_BASE_PATH}/plots`,
  cultivationZones: `${FARM_BASE_PATH}/production-zones`,
  plantIdentifications: `${FARM_BASE_PATH}/production-identifications`,
} as const;
