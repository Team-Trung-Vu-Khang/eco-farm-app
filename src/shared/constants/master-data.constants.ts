export const MASTER_DATA_BASE_PATH = "/api/admin/master-data" as const;

export const MASTER_DATA_PATHS = {
  base: MASTER_DATA_BASE_PATH,
  banks: `${MASTER_DATA_BASE_PATH}/banks`,
  businessLines: `${MASTER_DATA_BASE_PATH}/business-lines`,
  certificateIssuers: `${MASTER_DATA_BASE_PATH}/certificate-issuers`,
  certificateStandards: `${MASTER_DATA_BASE_PATH}/certificate-standards`,
  organizationTypes: `${MASTER_DATA_BASE_PATH}/organization-types`,
  geoProvinces: `${MASTER_DATA_BASE_PATH}/geo/provinces`,
  geoWards: `${MASTER_DATA_BASE_PATH}/geo/wards`,
  equipmentToolGroups: `${MASTER_DATA_BASE_PATH}/equipment-tool-groups`,
  fertilizerGroups: `${MASTER_DATA_BASE_PATH}/fertilizer-groups`,
  irrigationSystems: `${MASTER_DATA_BASE_PATH}/rearing-methods`,
  rearingMethods: `${MASTER_DATA_BASE_PATH}/rearing-methods`,
  materialGroups: `${MASTER_DATA_BASE_PATH}/material-groups`,
  medicineGroups: `${MASTER_DATA_BASE_PATH}/medicine-groups`,
  planGroups: `${MASTER_DATA_BASE_PATH}/plan-groups`,
  planTypes: `${MASTER_DATA_BASE_PATH}/plan-types`,
  vsicIndustries: `${MASTER_DATA_BASE_PATH}/vsic-industries`,
  seasons: `${MASTER_DATA_BASE_PATH}/seasons`,
} as const;

export const MASTER_DATA_CATALOGS = [
  "banks",
  "business-lines",
  "departments",
  "equipment-tool-groups",
  "fertilizer-groups",
  "irrigation-systems",
  "rearing-methods",
  "iot-device-groups",
  "material-groups",
  "medicine-groups",
  "plan-groups",
  "plan-types",
  "position-groups",
  "positions",
  "certificate-issuers",
  "certificate-standards",
  "organization-types",
  "vsic-industries",
] as const;

export type MasterDataCatalog = (typeof MASTER_DATA_CATALOGS)[number];
