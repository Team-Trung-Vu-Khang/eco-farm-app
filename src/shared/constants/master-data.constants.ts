export const MASTER_DATA_BASE_PATH = "/api/master-data" as const;

export const MASTER_DATA_PATHS = {
  base: MASTER_DATA_BASE_PATH,
  banks: `${MASTER_DATA_BASE_PATH}/banks`,
} as const;

export const MASTER_DATA_CATALOGS = [
  "banks",
  "business-lines",
  "departments",
  "equipment-tool-groups",
  "fertilizer-groups",
  "iot-device-groups",
  "material-groups",
  "pesticide-groups",
  "pesticide-origins",
  "pesticide-toxicity-classes",
  "plan-groups",
  "position-groups",
  "positions",
] as const;

export type MasterDataCatalog = (typeof MASTER_DATA_CATALOGS)[number];
