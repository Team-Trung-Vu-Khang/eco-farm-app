export const FARM_BASE_PATH = "/api/farm";

/**
 * Flag bật/tắt linh động giữa UI enum mục đích mới và cũ:
 * - true  : Hiện UI mới với 7 enum (Dinh dưỡng, Chăm sóc cây, Sâu bệnh hại, Cỏ dại, Tưới tiêu, Thu hoạch, Khác)
 * - false : Hiện UI cũ với 5 enum (Canh tác, Nâng cấp CSVC, Điều trị, Cải tạo đất, Thu hoạch)
 */
export const ENABLE_NEW_PURPOSE_ENUMS = true;

/** Nhãn hiển thị chung cho toàn bộ enum mục đích kế hoạch (FarmPlanPurpose). */
export const FARM_PLAN_PURPOSE_LABELS: Record<string, string> = {
  CULTIVATION: "Canh tác",
  FACILITY_UPGRADE: "Nâng cấp CSVC",
  TREATMENT: "Điều trị",
  SOIL_IMPROVEMENT: "Cải tạo đất",
  HARVEST: "Thu hoạch",
  NUTRITION: "Dinh dưỡng",
  PLANT_CARE: "Chăm sóc cây",
  PEST_DISEASE: "Sâu bệnh hại",
  WEED_CONTROL: "Cỏ dại",
  IRRIGATION: "Tưới tiêu",
  OTHER: "Khác",
};

export const FARM_ENDPOINTS = {
  seeds: `${FARM_BASE_PATH}/subject-variants`,
  regions: `${FARM_BASE_PATH}/production-regions`,
  areas: `${FARM_BASE_PATH}/production-areas`,
  plots: `${FARM_BASE_PATH}/production-units`,
  cultivationZones: `${FARM_BASE_PATH}/production-zones`,
  plantIdentifications: `${FARM_BASE_PATH}/production-identifications`,
  plantIdentificationBulkUpload: `${FARM_BASE_PATH}/production-identifications/bulk-upload`,
  plantIdentificationResolveLocation: `${FARM_BASE_PATH}/production-identifications/resolve-location`,
  productionHealthMetrics: `${FARM_BASE_PATH}/production-health-metrics`,
  productionHealthMetricsWorkspace: `${FARM_BASE_PATH}/production-health-metrics/workspace`,
  adminProductionZoneGroups: `/api/admin/farm/production-zones/groups`,
  adminProductionZones: `/api/admin/farm/production-zones`,
} as const;


