import type { FarmPlanPurpose } from "@/features/farm-daily-diary/types/farm-daily-diary.type";

export const FARM_BASE_PATH = "/api/farm";

/**
 * Flag bật/tắt linh động giữa UI enum mục đích mới và cũ:
 * - true  : Hiện UI mới với 7 enum (Dinh dưỡng, Chăm sóc cây, Sâu bệnh hại, Cỏ dại, Tưới tiêu, Thu hoạch, Khác)
 * - false : Hiện UI cũ với 5 enum (Canh tác, Nâng cấp CSVC, Điều trị, Cải tạo đất, Thu hoạch)
 */
export const ENABLE_NEW_PURPOSE_ENUMS = true;

/** Nhãn hiển thị chung cho toàn bộ enum mục đích kế hoạch (FarmPlanPurpose). */
/** Nhóm mục đích nhật ký theo tab lịch sử cây trồng (Canh tác / Bệnh / Thu hoạch) */
export const DIARY_PURPOSE_GROUPS = {
  farming: [
    "CULTIVATION",
    "NUTRITION",
    "PLANT_CARE",
    "SOIL_IMPROVEMENT",
    "WEED_CONTROL",
    "IRRIGATION",
    "OTHER",
  ],
  disease: ["PEST_DISEASE", "TREATMENT"],
  harvest: ["HARVEST"],
} as const satisfies Record<string, readonly FarmPlanPurpose[]>;

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
  base: FARM_BASE_PATH,

  // ─── Đơn vị & Tổ chức nội bộ (Workspace-scoped) ───
  organizations: `${FARM_BASE_PATH}/organizations`,
  organizationSearch: `${FARM_BASE_PATH}/organizations/search`,
  branches: `${FARM_BASE_PATH}/branches`,
  contacts: `${FARM_BASE_PATH}/contacts`,
  contactLinks: `${FARM_BASE_PATH}/contact-links`,
  contactGroups: `${FARM_BASE_PATH}/contact-groups`,
  bankAccounts: `${FARM_BASE_PATH}/bank-accounts`,
  legalIdentifications: `${FARM_BASE_PATH}/legal-identifications`,
  certificates: `${FARM_BASE_PATH}/certificates`,
  adminCertificates: `/api/admin/farm/certificates`,

  // ─── Nhân sự & Phòng ban nội bộ Farm ───
  departments: `${FARM_BASE_PATH}/departments`,
  positions: `${FARM_BASE_PATH}/positions`,
  teams: `${FARM_BASE_PATH}/teams`,
  personnel: `${FARM_BASE_PATH}/personnel`,
  adminPersonnel: `/api/admin/farm/personnel`,

  // ─── Vùng trồng & Thứ bậc sản xuất ───
  seeds: `${FARM_BASE_PATH}/subject-variants`,
  regions: `${FARM_BASE_PATH}/production-regions`,
  areas: `${FARM_BASE_PATH}/production-areas`,
  plots: `${FARM_BASE_PATH}/production-units`,
  cultivationZones: `${FARM_BASE_PATH}/production-zones`,
  adminProductionZones: `/api/admin/farm/production-zones`,
  adminProductionZoneGroups: `/api/admin/farm/production-zones/groups`,

  // ─── Nhận diện cây trồng / Thủy sản ───
  plantIdentifications: `${FARM_BASE_PATH}/production-identifications`,
  plantIdentificationBulkUpload: `${FARM_BASE_PATH}/production-identifications/bulk-upload`,
  plantIdentificationResolveLocation: `${FARM_BASE_PATH}/production-identifications/resolve-location`,

  // ─── Vật tư & Quy đổi ───
  supplies: `${FARM_BASE_PATH}/supplies`,
  supplyConversionRules: `${FARM_BASE_PATH}/supplies/conversion-rules`,
  adminSupplyConversionRules: `/api/admin/master-data/supply-conversion-rules`,

  // ─── Kế hoạch & Nhật ký ───
  seasons: `${FARM_BASE_PATH}/seasons`,
  tasks: `${FARM_BASE_PATH}/tasks`,
  workflows: `${FARM_BASE_PATH}/workflows`,
  plans: `${FARM_BASE_PATH}/plans`,
  diaryEntries: `${FARM_BASE_PATH}/diary-entries`,
  dailyDiaryEntries: `${FARM_BASE_PATH}/daily-diary-entries`,
  planTaskDiaryEntries: `${FARM_BASE_PATH}/plan-task-diary-entries`,

  // ─── Báo cáo & Dashboard Farm ───
  dashboardLowStockSupplies: `${FARM_BASE_PATH}/dashboard/low-stock-supplies`,
  dashboardExpiringContracts: `${FARM_BASE_PATH}/dashboard/expiring-contracts`,
  dashboardProductionHealth: `${FARM_BASE_PATH}/dashboard/production-health`,
  dashboardHarvestProduction: `${FARM_BASE_PATH}/dashboard/harvest-production`,
  dashboardGeoSummary: `${FARM_BASE_PATH}/dashboard/geo-summary`,
  productionHealthMetrics: `${FARM_BASE_PATH}/production-health-metrics`,
  productionHealthMetricsWorkspace: `${FARM_BASE_PATH}/production-health-metrics/workspace`,
  productionZoneHarvestStats: (zoneId: number | string) =>
    `${FARM_BASE_PATH}/production-zones/${zoneId}/harvest-stats`,
  productionZoneHarvestChart: (zoneId: number | string) =>
    `${FARM_BASE_PATH}/production-zones/${zoneId}/harvest-chart`,
  productionZoneHarvestBySubject: (zoneId: number | string) =>
    `${FARM_BASE_PATH}/production-zones/${zoneId}/harvest-by-subject`,

  // ─── Báo cáo Admin Nông trại (be-mevi-farm) ───
  adminDashboardWorkspaces: `/api/admin/dashboard/workspaces`,
  adminReportActiveFarmers: `/api/admin/farm/report/active-farmers`,
  adminReportActiveFarmersWorkspaces: `/api/admin/farm/report/active-farmers/workspaces`,
  adminReportActiveFarmersExportJobs: `/api/admin/farm/report/active-farmers/export-jobs`,
  adminReportHarvestByVariant: `/api/admin/farm/report/harvest-by-variant`,
  adminReportHarvestByVariantDetail: `/api/admin/farm/report/harvest-by-variant/detail`,
  adminReportHarvestBySubject: `/api/admin/farm/report/harvest-by-subject`,
  adminReportDiaryActivitySummary: `/api/admin/farm/report/diary-activity/summary`,
  adminReportDiaryActivityWorkspaces: `/api/admin/farm/report/diary-activity/workspaces`,
  adminReportProductionVariants: `${FARM_BASE_PATH}/report/production-subject-variants`,
  reportVariantCards: `${FARM_BASE_PATH}/report/production-subject-variant-cards`,
  reportSupplyConsumptionStats: `${FARM_BASE_PATH}/report/supply-consumption-stats`,
  reportProductionPlanStats: `${FARM_BASE_PATH}/report/production-plan-stats`,
  reportTaskNameStats: `${FARM_BASE_PATH}/report/task-name-stats`,
  reportTaskNameRanking: `${FARM_BASE_PATH}/report/task-name-ranking`,
  reportEndpoint: (basePath: string, isAdmin: boolean) =>
    isAdmin ? `/api/admin${basePath.replace(/^\/api/, "")}` : basePath,
  adminExports: (id: string | number) => `/api/exports/${id}`,
} as const;



