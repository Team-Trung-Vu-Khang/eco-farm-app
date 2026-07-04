export const FARM_BASE_PATH = "/api/farm";

export const FARM_ENDPOINTS = {
  seeds: `${FARM_BASE_PATH}/seeds`,
  regions: `${FARM_BASE_PATH}/regions`,
  areas: `${FARM_BASE_PATH}/areas`,
  plots: `${FARM_BASE_PATH}/plots`,
} as const;
