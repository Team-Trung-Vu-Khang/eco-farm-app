export const MASTER_DATA_BASE_PATH = "/api/master-data" as const;

export const MASTER_DATA_PATHS = {
  base: MASTER_DATA_BASE_PATH,
  banks: `${MASTER_DATA_BASE_PATH}/banks`,
  businessLines: `${MASTER_DATA_BASE_PATH}/business-lines`,
  certificateIssuers: `${MASTER_DATA_BASE_PATH}/certificate-issuers`,
  certificateStandards: `${MASTER_DATA_BASE_PATH}/certificate-standards`,
  geoProvinces: `${MASTER_DATA_BASE_PATH}/geo/provinces`,
  geoWards: `${MASTER_DATA_BASE_PATH}/geo/wards`,
  equipmentToolGroups: `${MASTER_DATA_BASE_PATH}/equipment-tool-groups`,
  fertilizerGroups: `${MASTER_DATA_BASE_PATH}/fertilizer-groups`,
  materialGroups: `${MASTER_DATA_BASE_PATH}/material-groups`,
  pesticideGroups: `${MASTER_DATA_BASE_PATH}/pesticide-groups`,
  pesticideOrigins: `${MASTER_DATA_BASE_PATH}/pesticide-origins`,
  pesticideToxicityClasses: `${MASTER_DATA_BASE_PATH}/pesticide-toxicity-classes`,
  planGroups: `${MASTER_DATA_BASE_PATH}/plan-groups`,
  planTypes: `${MASTER_DATA_BASE_PATH}/plan-types`,
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
  "plan-types",
  "position-groups",
  "positions",
  "certificate-issuers",
  "certificate-standards",
  "vsic-industries",
] as const;

export type MasterDataCatalog = (typeof MASTER_DATA_CATALOGS)[number];
