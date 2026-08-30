export const FARM_BASE_PATH = "/api/farm";

export const FARM_ENDPOINTS = {
  seeds: `${FARM_BASE_PATH}/subject-variants`,
  regions: `${FARM_BASE_PATH}/production-regions`,
  areas: `${FARM_BASE_PATH}/production-areas`,
  plots: `${FARM_BASE_PATH}/production-units`,
  cultivationZones: `${FARM_BASE_PATH}/production-zones`,
  plantIdentifications: `${FARM_BASE_PATH}/production-identifications`,
  plantIdentificationResolveLocation: `${FARM_BASE_PATH}/production-identifications/resolve-location`,
  productionHealthMetrics: `${FARM_BASE_PATH}/production-health-metrics`,
  productionHealthMetricsWorkspace: `${FARM_BASE_PATH}/production-health-metrics/workspace`,
} as const;
