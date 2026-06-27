export const MASTER_DATA_BASE_PATH = "/api/master-data" as const;

export const MASTER_DATA_PATHS = {
  base: MASTER_DATA_BASE_PATH,
  banks: `${MASTER_DATA_BASE_PATH}/banks`,
  businessLines: `${MASTER_DATA_BASE_PATH}/business-lines`,
  certificateIssuers: `${MASTER_DATA_BASE_PATH}/certificate-issuers`,
  certificateStandards: `${MASTER_DATA_BASE_PATH}/certificate-standards`,
  vsicIndustries: `${MASTER_DATA_BASE_PATH}/vsic-industries`,
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
  "certificate-issuers",
  "certificate-standards",
  "vsic-industries",
] as const;

export type MasterDataCatalog = (typeof MASTER_DATA_CATALOGS)[number];
