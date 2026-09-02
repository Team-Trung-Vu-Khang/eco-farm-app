import { lazy, useEffect } from "react";
import { Route, Switch, useLocation, useParams } from "wouter";

import { useFarmPlanById } from "@/features/farm-workflow/hooks";
import { ReportProvider } from "./pages/reports/context/ReportContext";
import { ReportPageContainer } from "./pages/reports/ReportPageContainer";
import { AdminReportPage } from "./pages/reports/AdminReportPage";

const DashboardPage = lazy(() => import("./pages/dashboard/Dashboard"));
const HistoryCreatePage = lazy(
  () => import("./pages/history/HistoryCreatePage"),
);
const HistoryPage = lazy(() => import("./pages/history/HistoryPage"));
const PlanDiaryPage = lazy(() => import("./pages/history/PlanDiaryPage"));
const PlanDiaryDetailPage = lazy(() => import("./pages/history/PlanDiaryDetailPage"));
const UpdateHistoryPage = lazy(() => import("./pages/history/UpdateHistoryPage"));
const TerrainPage = lazy(() => import("./pages/terrain/TerrainPage"));

const EnterprisePage = lazy(() => import("./pages/enterprise/EnterprisePage"));
const EnterpriseCreatePage = lazy(
  () => import("./pages/enterprise/EnterpriseCreatePage"),
);
const EnterpriseDetailPage = lazy(
  () => import("./pages/enterprise/EnterpriseDetailPage"),
);
const EnterpriseEditPage = lazy(
  () => import("./pages/enterprise/EnterpriseEditPage"),
);
const BranchPage = lazy(() => import("./pages/branch/BranchPage"));
const BranchFormPage = lazy(() => import("./pages/branch/BranchFormPage"));
const BranchDetailPage = lazy(() => import("./pages/branch/BranchDetailPage"));
const CropPage = lazy(() => import("./pages/crop/CropPage"));
const CropCreatePage = lazy(() => import("./pages/crop/CropCreatePage"));
const CropDetailPage = lazy(() => import("./pages/crop/CropDetailPage"));
const CropFoundationPage = lazy(
  () => import("./pages/crop-foundation/CropFoundationPage"),
);
const CropFoundationCreatePage = lazy(
  () => import("./pages/crop-foundation/CropFoundationCreatePage"),
);
const CropFoundationDetailPage = lazy(
  () => import("./pages/crop-foundation/CropFoundationDetailPage"),
);
const CropFoundationEditPage = lazy(
  () => import("./pages/crop-foundation/CropFoundationEditPage"),
);

const PesticidePage = lazy(() => import("./pages/pesticide/PesticidePage"));
const PesticideCreatePage = lazy(
  () => import("./pages/pesticide/PesticideCreatePage"),
);
const PesticideDetailPage = lazy(
  () => import("./pages/pesticide/PesticideDetailPage"),
);
const PlanPage = lazy(() => import("./pages/plan/PlanPage"));
const PlanCreatePage = lazy(() => import("./pages/plan/PlanCreatePage"));
const PlanDetailPage = lazy(() => import("./pages/plan/PlanDetailPage"));
const PlanEditPage = lazy(() => import("./pages/plan/PlanEditPage"));
const PlanWorkflowPage = lazy(() => import("./pages/plan/PlanWorkflowPage"));
const PlanGrowthPage = lazy(() => import("./pages/plan-growth/PlanGrowthPage"));
const PlanGrowthCreatePage = lazy(
  () => import("./pages/plan-growth/PlanGrowthCreatePage"),
);
const PlanGrowthCreateWorkflowPage = lazy(
  () => import("./pages/plan-growth/PlanGrowthCreateWorkflowPage"),
);
const PlanGrowthDetailPage = lazy(
  () => import("./pages/plan-growth/PlanGrowthDetailPage"),
);
const PlanGrowthWorkflowPlansPage = lazy(
  () => import("./pages/plan-growth/PlanGrowthWorkflowPlansPage"),
);
const PlanGrowthEditPage = lazy(
  () => import("./pages/plan-growth/PlanGrowthEditPage"),
);
const PlanGrowthWorkflowStageEditPage = lazy(
  () => import("./pages/plan-growth/PlanGrowthWorkflowStageEditPage"),
);
const PlanGrowthWorkflowDetailEditPage = lazy(
  () => import("./pages/plan-growth/PlanGrowthWorkflowDetailEditPage"),
);
const PlanGrowthWorkflowInfoFormPage = lazy(
  () => import("./pages/plan-growth/PlanGrowthWorkflowInfoFormPage"),
);
const PlanGrowthWorkflowPage = lazy(
  () => import("./pages/plan-growth/PlanGrowthWorkflowPage"),
);
const PlanAnimalGrowthPage = lazy(
  () => import("./pages/plan-animal-growth/PlanAnimalGrowthPage"),
);
const PlanAnimalGrowthCreatePage = lazy(
  () => import("./pages/plan-animal-growth/PlanAnimalGrowthCreatePage"),
);
const PlanAnimalGrowthDetailPage = lazy(
  () => import("./pages/plan-animal-growth/PlanAnimalGrowthDetailPage"),
);
const PlanAnimalGrowthEditPage = lazy(
  () => import("./pages/plan-animal-growth/PlanAnimalGrowthEditPage"),
);
const PlanAnimalGrowthWorkflowPage = lazy(
  () => import("./pages/plan-animal-growth/PlanAnimalGrowthWorkflowPage"),
);
const PlanAnimalGrowthWorkflowPlansPage = lazy(
  () => import("./pages/plan-animal-growth/PlanAnimalGrowthWorkflowPlansPage"),
);
const PlanAnimalGrowthCreateWorkflowPage = lazy(
  () => import("./pages/plan-animal-growth/PlanAnimalGrowthCreateWorkflowPage"),
);
const PlanAnimalGrowthWorkflowStageEditPage = lazy(
  () =>
    import("./pages/plan-animal-growth/PlanAnimalGrowthWorkflowStageEditPage"),
);
const PlanAnimalGrowthWorkflowDetailEditPage = lazy(
  () =>
    import("./pages/plan-animal-growth/PlanAnimalGrowthWorkflowDetailEditPage"),
);
const PlanAnimalGrowthWorkflowInfoFormPage = lazy(
  () =>
    import("./pages/plan-animal-growth/PlanAnimalGrowthWorkflowInfoFormPage"),
);
const PlanAquacultureGrowthPage = lazy(
  () => import("./pages/plan-aquaculture-growth/PlanAquacultureGrowthPage"),
);
const PlanAquacultureGrowthCreatePage = lazy(
  () =>
    import("./pages/plan-aquaculture-growth/PlanAquacultureGrowthCreatePage"),
);
const PlanAquacultureGrowthDetailPage = lazy(
  () =>
    import("./pages/plan-aquaculture-growth/PlanAquacultureGrowthDetailPage"),
);
const PlanAquacultureGrowthEditPage = lazy(
  () => import("./pages/plan-aquaculture-growth/PlanAquacultureGrowthEditPage"),
);
const PlanAquacultureGrowthWorkflowPage = lazy(
  () =>
    import("./pages/plan-aquaculture-growth/PlanAquacultureGrowthWorkflowPage"),
);
const PlanAquacultureGrowthWorkflowPlansPage = lazy(
  () =>
    import("./pages/plan-aquaculture-growth/PlanAquacultureGrowthWorkflowPlansPage"),
);
const PlanAquacultureGrowthCreateWorkflowPage = lazy(
  () =>
    import("./pages/plan-aquaculture-growth/PlanAquacultureGrowthCreateWorkflowPage"),
);
const PlanAquacultureGrowthWorkflowStageEditPage = lazy(
  () =>
    import("./pages/plan-aquaculture-growth/PlanAquacultureGrowthWorkflowStageEditPage"),
);
const PlanAquacultureGrowthWorkflowDetailEditPage = lazy(
  () =>
    import("./pages/plan-aquaculture-growth/PlanAquacultureGrowthWorkflowDetailEditPage"),
);
const PlanAquacultureGrowthWorkflowInfoFormPage = lazy(
  () =>
    import("./pages/plan-aquaculture-growth/PlanAquacultureGrowthWorkflowInfoFormPage"),
);
const PlanTypePage = lazy(() => import("./pages/plan-type/PlanTypePage"));
const FertilizerCreatePage = lazy(
  () => import("./pages/fertilizer/FertilizerCreatePage"),
);
const FertilizerDetailPage = lazy(
  () => import("./pages/fertilizer/FertilizerDetailPage"),
);
const MaterialCreatePage = lazy(
  () => import("./pages/material/MaterialCreatePage"),
);
const MaterialDetailPage = lazy(
  () => import("./pages/material/MaterialDetailPage"),
);
const EquipmentCreatePage = lazy(
  () => import("./pages/equipment/EquipmentCreatePage"),
);
const EquipmentDetailPage = lazy(
  () => import("./pages/equipment/EquipmentDetailPage"),
);

// Animal Husbandry Material Pages
const AhPesticidePage = lazy(
  () => import("./pages/ah-pesticide/AhPesticidePage"),
);
const AhPesticideCreatePage = lazy(
  () => import("./pages/ah-pesticide/AhPesticideCreatePage"),
);
const AhPesticideDetailPage = lazy(
  () => import("./pages/ah-pesticide/AhPesticideDetailPage"),
);
const AhMaterialPage = lazy(() => import("./pages/ah-material/AhMaterialPage"));
const AhMaterialCreatePage = lazy(
  () => import("./pages/ah-material/AhMaterialCreatePage"),
);
const AhMaterialDetailPage = lazy(
  () => import("./pages/ah-material/AhMaterialDetailPage"),
);
const AhEquipmentPage = lazy(
  () => import("./pages/ah-equipment/AhEquipmentPage"),
);
const AhEquipmentCreatePage = lazy(
  () => import("./pages/ah-equipment/AhEquipmentCreatePage"),
);
const AhEquipmentDetailPage = lazy(
  () => import("./pages/ah-equipment/AhEquipmentDetailPage"),
);

// Aquaculture Material Pages
const AqPesticidePage = lazy(
  () => import("./pages/aq-pesticide/AqPesticidePage"),
);
const AqPesticideCreatePage = lazy(
  () => import("./pages/aq-pesticide/AqPesticideCreatePage"),
);
const AqPesticideDetailPage = lazy(
  () => import("./pages/aq-pesticide/AqPesticideDetailPage"),
);
const AqMaterialPage = lazy(() => import("./pages/aq-material/AqMaterialPage"));
const AqMaterialCreatePage = lazy(
  () => import("./pages/aq-material/AqMaterialCreatePage"),
);
const AqMaterialDetailPage = lazy(
  () => import("./pages/aq-material/AqMaterialDetailPage"),
);
const AqEquipmentPage = lazy(
  () => import("./pages/aq-equipment/AqEquipmentPage"),
);
const AqEquipmentCreatePage = lazy(
  () => import("./pages/aq-equipment/AqEquipmentCreatePage"),
);
const AqEquipmentDetailPage = lazy(
  () => import("./pages/aq-equipment/AqEquipmentDetailPage"),
);

// Warehouse Pages
const InventoryAreaPage = lazy(
  () => import("./pages/inventory-area/InventoryAreaPage"),
);
const InventoryAreaCreatePage = lazy(
  () => import("./pages/inventory-area/InventoryAreaCreatePage"),
);
const CropMaterialInventoryPage = lazy(
  () => import("./pages/crop-material-inventory/CropMaterialInventoryPage"),
);
const LivestockMaterialInventoryPage = lazy(
  () =>
    import("./pages/livestock-material-inventory/LivestockMaterialInventoryPage"),
);
const AquacultureMaterialInventoryPage = lazy(
  () =>
    import("./pages/aquaculture-material-inventory/AquacultureMaterialInventoryPage"),
);
const InventoryLookupPage = lazy(
  () => import("./pages/inventory-lookup/InventoryLookupPage"),
);
const InventoryInPage = lazy(
  () => import("./pages/inventory-in/InventoryInPage"),
);
const InventoryOutPage = lazy(
  () => import("./pages/inventory-out/InventoryOutPage"),
);

const UnitCreatePage = lazy(() => import("./pages/unit/UnitCreatePage"));
const IoTDevicePage = lazy(() => import("./pages/iot-device/IoTDevicePage"));
const IoTDeviceCreatePage = lazy(
  () => import("./pages/iot-device/IoTDeviceCreatePage"),
);
const IoTDeviceDetailPage = lazy(
  () => import("./pages/iot-device/IoTDeviceDetailPage"),
);
const IoTMapViewPage = lazy(
  () => import("./pages/iot-device/monitoring/IoTMapViewPage"),
);
const IoTDeviceGroupPage = lazy(
  () => import("./pages/iot-device-group/IoTDeviceGroupPage"),
);
const IrrigationSystemPage = lazy(
  () => import("./pages/irrigation-system/IrrigationSystemPage"),
);
const AquacultureIdentificationListPage = lazy(
  () =>
    import("./pages/aquaculture-identification/AquacultureIdentificationListPage"),
);
const AquacultureIdentificationCreatePage = lazy(
  () =>
    import("./pages/aquaculture-identification/AquacultureIdentificationCreatePage"),
);
const AquacultureIdentificationSearchPage = lazy(
  () =>
    import("./pages/aquaculture-identification/AquacultureIdentificationSearchPage"),
);
const AquacultureIdentificationDetailPage = lazy(
  () =>
    import("./pages/aquaculture-identification/AquacultureIdentificationDetailPage"),
);
const AquacultureIdentificationEditPage = lazy(
  () =>
    import("./pages/aquaculture-identification/AquacultureIdentificationEditPage"),
);

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const BankPage = lazy(() => import("./pages/bank/BankPage"));
const BankDirectoryPage = lazy(
  () => import("./pages/bank-directory/BankDirectoryPage"),
);
const BankCreatePage = lazy(() => import("./pages/bank/BankCreatePage"));
const BankEditPage = lazy(() => import("./pages/bank/BankEditPage"));
const GeoZonePage = lazy(() => import("./pages/geo-zone/GeoZonePage"));

// Region Chart Pages
const RegionDistributionPage = lazy(
  () =>
    import("./pages/region-chart/region-distribution/RegionDistributionPage"),
);
const RegionCreatePage = lazy(
  () => import("./pages/region-chart/region-distribution/RegionCreatePage"),
);
const AreaDistributionPage = lazy(
  () => import("./pages/region-chart/area-distribution/AreaDistributionPage"),
);
const AreaCreatePage = lazy(
  () => import("./pages/region-chart/area-distribution/AreaCreatePage"),
);
const AreaDetailPage = lazy(
  () => import("./pages/region-chart/area-distribution/AreaDetailPage"),
);
const PlotDistributionPage = lazy(
  () => import("./pages/region-chart/plot-distribution/PlotDistributionPage"),
);
const PlotCreatePage = lazy(
  () => import("./pages/region-chart/plot-distribution/PlotCreatePage"),
);
const PlotDetailPage = lazy(
  () => import("./pages/region-chart/plot-distribution/PlotDetailPage"),
);
const MapViewPage = lazy(
  () => import("./pages/region-chart/map-view/MapViewPage"),
);
const RegionBasicDistributionPage = lazy(
  () =>
    import("./pages/region-chart/region-basic-distribution/RegionBasicDistributionPage"),
);
const RegionBasicDistributionCreateEditPage = lazy(
  () =>
    import("./pages/region-chart/region-basic-distribution/RegionBasicDistributionCreateEditPage"),
);
const RegionBasicDistributionDetailPage = lazy(
  () =>
    import("./pages/region-chart/region-basic-distribution/RegionBasicDistributionDetailPage"),
);
const RegionBasicDistributionLivestockPage = lazy(
  () =>
    import("./pages/region-chart/region-basic-distribution-livestock/RegionBasicDistributionLivestockPage"),
);
const RegionBasicDistributionLivestockCreateEditPage = lazy(
  () =>
    import("./pages/region-chart/region-basic-distribution-livestock/RegionBasicDistributionLivestockCreateEditPage"),
);
const RegionBasicDistributionLivestockDetailPage = lazy(
  () =>
    import("./pages/region-chart/region-basic-distribution-livestock/RegionBasicDistributionLivestockDetailPage"),
);
const RegionBasicDistributionAquaculturePage = lazy(
  () =>
    import("./pages/region-chart/region-basic-distribution-aquaculture/RegionBasicDistributionAquaculturePage"),
);
const RegionBasicDistributionAquacultureCreateEditPage = lazy(
  () =>
    import("./pages/region-chart/region-basic-distribution-aquaculture/RegionBasicDistributionAquacultureCreateEditPage"),
);
const RegionBasicDistributionAquacultureDetailPage = lazy(
  () =>
    import("./pages/region-chart/region-basic-distribution-aquaculture/RegionBasicDistributionAquacultureDetailPage"),
);
const LegalIdentificationPage = lazy(
  () => import("./pages/legal-identification/LegalIdentificationPage"),
);
const LegalIdentificationCreateEditPage = lazy(
  () =>
    import("./pages/legal-identification/LegalIdentificationCreateEditPage"),
);
const LegalIdentificationDetailPage = lazy(
  () => import("./pages/legal-identification/LegalIdentificationDetailPage"),
);
const SoilAmendmentMapPage = lazy(
  () => import("./pages/region-chart/soil-map/SoilAmendmentMapPage"),
);
const AmendmentCyclePage = lazy(
  () => import("./pages/soil-amendment/AmendmentCyclePage"),
);
const AmendmentMethodPage = lazy(
  () => import("./pages/soil-amendment/AmendmentMethodPage"),
);
const AmendmentPlanPage = lazy(
  () => import("./pages/soil-amendment/AmendmentPlanPage"),
);
const AmendmentPlanCreatePage = lazy(
  () => import("./pages/soil-amendment/AmendmentPlanCreatePage"),
);
const AmendmentTaskPage = lazy(
  () => import("./pages/soil-amendment/AmendmentTaskPage"),
);
const SoilAmendmentTreatmentPage = lazy(
  () => import("./pages/soil-amendment/SoilAmendmentTreatmentPage"),
);

// Cultivation Zone Sub-pages
const CultivationRegionPage = lazy(
  () =>
    import("./pages/cultivation-zone/cultivation-region/CultivationRegionPage"),
);
const AquacultureRegionPage = lazy(
  () => import("./pages/aquaculture-region/AquacultureRegionPage"),
);
const CultivationRegionCreatePage = lazy(
  () =>
    import("./pages/cultivation-zone/cultivation-region/CultivationRegionCreatePage"),
);
const AquacultureRegionCreatePage = lazy(
  () => import("./pages/aquaculture-region/AquacultureRegionCreatePage"),
);
const CultivationRegionWorkflowPage = lazy(
  () =>
    import("./pages/cultivation-zone/cultivation-region/CultivationRegionWorkflowPage"),
);
const AquacultureRegionWorkflowPage = lazy(
  () => import("./pages/aquaculture-region/AquacultureRegionWorkflowPage"),
);
const DistributionDetailPage = lazy(
  () =>
    import("./pages/cultivation-zone/distribution-detail/DistributionDetailPage"),
);
const AquacultureDistributionDetailPage = lazy(
  () =>
    import("./pages/aquaculture-distribution-detail/AquacultureDistributionDetailPage"),
);
const AquacultureDistributionCreatePage = lazy(
  () =>
    import("./pages/aquaculture-distribution-detail/AquacultureDistributionCreatePage"),
);
const AquacultureDistributionListPage = lazy(
  () =>
    import("./pages/aquaculture-distribution-detail/AquacultureDistributionListPage"),
);
const PlantDistributionCreatePage = lazy(
  () =>
    import("./pages/cultivation-zone/distribution-detail/PlantDistributionCreatePage"),
);
const SearchCropPage = lazy(
  () => import("./pages/cultivation-zone/search-crop/SearchCropPage"),
);
const SearchZonePage = lazy(
  () => import("./pages/cultivation-zone/search-zone/SearchZonePage"),
);
const AquacultureSearchFarmPage = lazy(
  () => import("./pages/aquaculture-search-farm/AquacultureSearchFarmPage"),
);
const SearchUnitPage = lazy(
  () => import("./pages/enterprise/search-unit/SearchUnitPage"),
);

const SeedPage = lazy(() => import("./pages/seed/SeedPage"));
const GrowthCyclePage = lazy(
  () => import("./pages/growth-cycle/GrowthCyclePage"),
);
const AquacultureGrowthCyclePage = lazy(
  () => import("./pages/aquaculture-growth-cycle/AquacultureGrowthCyclePage"),
);
const CreateAquacultureGrowthCyclePage = lazy(
  () =>
    import("./pages/aquaculture-growth-cycle/CreateAquacultureGrowthCyclePage"),
);
const AquacultureGrowthCycleEditPage = lazy(
  () =>
    import("./pages/aquaculture-growth-cycle/AquacultureGrowthCycleEditPage"),
);
const CreateGrowthCyclePage = lazy(
  () => import("./pages/growth-cycle/CreateGrowthCyclePage"),
);
const UpdateGrowthCyclePage = lazy(
  () => import("./pages/growth-cycle/UpdateGrowthCyclePage"),
);
const GrowthCycleWorkflowPage = lazy(
  () => import("./pages/growth-cycle/GrowthCycleWorkflowPage"),
);
const SeasonPage = lazy(() => import("./pages/season/SeasonPage"));
const CreateSeasonPage = lazy(() => import("./pages/season/CreateSeasonPage"));
const UpdateSeasonPage = lazy(() => import("./pages/season/UpdateSeasonPage"));
const SeasonDetailPage = lazy(() => import("./pages/season/SeasonDetailPage"));
const LandPage = lazy(() => import("./pages/land/LandPage"));
const FarmingMethodPage = lazy(
  () => import("./pages/farming-method/FarmingMethodPage"),
);
const FarmingMethodCropPage = lazy(
  () => import("./pages/farming-method/FarmingMethodCropPage"),
);
const CertificatePage = lazy(
  () => import("./pages/certificate/CertificatePage"),
);
const ContactPage = lazy(() => import("./pages/contact/ContactPage"));
const ContactCreatePage = lazy(
  () => import("./pages/contact/ContactCreatePage"),
);
const ContactEditPage = lazy(() => import("./pages/contact/ContactEditPage"));
const DepartmentPage = lazy(() => import("./pages/department/DepartmentPage"));
const OwnerDepartmentPage = lazy(
  () => import("./pages/owner-department/DepartmentPage"),
);
const GroupPositionPage = lazy(
  () => import("./pages/group-position/GroupPositionPage"),
);
const PositionPage = lazy(() => import("./pages/position/PositionPage"));
const OwnerPositionPage = lazy(
  () => import("./pages/owner-position/OwnerPositionPage"),
);
const PositionDetailPage = lazy(
  () => import("./pages/position/PositionDetailPage"),
);
const OwnerPositionDetailPage = lazy(
  () => import("./pages/owner-position/OwnerPositionDetailPage"),
);
const PersonnelPage = lazy(() => import("./pages/personnel/PersonnelPage"));
const PersonnelCreatePage = lazy(
  () => import("./pages/personnel/PersonnelCreatePage"),
);
const PersonnelEditPage = lazy(
  () => import("./pages/personnel/PersonnelEditPage"),
);
const TeamPage = lazy(() => import("./pages/team/TeamPage"));
const TeamCreatePage = lazy(() => import("./pages/team/TeamCreatePage"));
const TeamEditPage = lazy(() => import("./pages/team/TeamEditPage"));
const TeamDetailPage = lazy(() => import("./pages/team/TeamDetailPage"));
const VarietyPage = lazy(() => import("./pages/variety/VarietyPage"));
const CreateVarietyPage = lazy(
  () => import("./pages/variety/CreateVarietyPage"),
);
const VarietyEditPage = lazy(() => import("./pages/variety/VarietyEditPage"));
const VarietyFoundationPage = lazy(
  () => import("./pages/variety-foundation/VarietyFoundationPage"),
);
const CreateVarietyFoundationPage = lazy(
  () => import("./pages/variety-foundation/CreateVarietyFoundationPage"),
);
const VarietyFoundationEditPage = lazy(
  () => import("./pages/variety-foundation/VarietyFoundationEditPage"),
);
const MaterialPage = lazy(() => import("./pages/material/MaterialPage"));
const FertilizerPage = lazy(() => import("./pages/fertilizer/FertilizerPage"));
const ContractPage = lazy(() => import("./pages/contract/ContractPage"));
const EquipmentPage = lazy(() => import("./pages/equipment/EquipmentPage"));
const UnitPage = lazy(() => import("./pages/unit/UnitPage"));
const TaskPage = lazy(() => import("./pages/task/TaskPage"));
const TaskCreatePage = lazy(() => import("./pages/task/TaskCreatePage"));
const TaskEditPage = lazy(() => import("./pages/task/TaskEditPage"));
const TaskDetailPage = lazy(() => import("./pages/task/TaskDetailPage"));
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));
const WorkspacePage = lazy(() => import("./pages/workspace/WorkspacePage"));
const RegionDetailPage = lazy(
  () => import("./pages/region-chart/region-distribution/RegionDetailPage"),
);
const CultivationRegionDetailPage = lazy(
  () =>
    import("./pages/cultivation-zone/cultivation-region/CultivationRegionDetailPage"),
);
const AquacultureRegionDetailPage = lazy(
  () => import("./pages/aquaculture-region/AquacultureRegionDetailPage"),
);

const ContractDetailPage = lazy(
  () => import("./pages/contract/ContractDetailPage"),
);
const ContractCreatePage = lazy(
  () => import("./pages/contract/ContractCreatePage"),
);
const ContractEditPage = lazy(
  () => import("./pages/contract/ContractEditPage"),
);
const TreatmentPage = lazy(() => import("./pages/treatment/TreatmentPage"));
const GroupCropPage = lazy(() => import("./pages/group-crop/GroupCropPage"));
const GroupLivestockPage = lazy(
  () => import("./pages/group-livestock/GroupLivestockPage"),
);
const GroupAquaPage = lazy(() => import("./pages/group-aqua/GroupAquaPage"));
const DocsPage = lazy(() => import("./pages/docs/DocsPage"));
const CreateDocsPage = lazy(() => import("./pages/docs/CreateDocsPage"));
const UpdateDocsPage = lazy(() => import("./pages/docs/UpdateDocsPage"));
const DocsDetailPage = lazy(() => import("./pages/docs/DocsDetailPage"));
const DocumentCategoryListPage = lazy(
  () => import("./pages/document-category/DocumentCategoryListPage"),
);
const DocumentCategoryCreatePage = lazy(
  () => import("./pages/document-category/DocumentCategoryCreatePage"),
);
const DocumentCategoryEditPage = lazy(
  () => import("./pages/document-category/DocumentCategoryEditPage"),
);
const DocumentCategoryDetailPage = lazy(
  () => import("./pages/document-category/DocumentCategoryDetailPage"),
);
const DocumentVersionPage = lazy(
  () => import("./pages/document-version/DocumentVersionPage"),
);
const RoleResponsibilityDetailPage = lazy(
  () => import("./pages/role-responsibility/RoleResponsibilityDetailPage"),
);
const RoleResponsibilityFormPage = lazy(
  () => import("./pages/role-responsibility/RoleResponsibilityFormPage"),
);
const RoleResponsibilityPage = lazy(
  () => import("./pages/role-responsibility/RoleResponsibilityPage"),
);
const CreateSeedPage = lazy(() => import("./pages/seed/CreateSeedPage"));
const SeedDetailPage = lazy(() => import("./pages/seed/SeedDetailPage"));
const UpdateSeedPage = lazy(() => import("./pages/seed/UpdateSeedPage"));
const CreateTreatmentPage = lazy(
  () => import("./pages/treatment/CreateTreatmentPage"),
);
const PlantDistributionListPage = lazy(
  () =>
    import("./pages/cultivation-zone/distribution-detail/PlantDistributionListPage"),
);
const FarmerPage = lazy(() => import("./pages/farmer/FarmerPage"));
const FarmerCreatePage = lazy(() => import("./pages/farmer/FarmerCreatePage"));
const FarmerEditPage = lazy(() => import("./pages/farmer/FarmerEditPage"));
const FarmerDetailPage = lazy(() => import("./pages/farmer/FarmerDetailPage"));
const CooperativePage = lazy(
  () => import("./pages/cooperative/CooperativePage"),
);
const CooperativeCreatePage = lazy(
  () => import("./pages/cooperative/CooperativeCreatePage"),
);
const CooperativeEditPage = lazy(
  () => import("./pages/cooperative/CooperativeEditPage"),
);
const CooperativeDetailPage = lazy(
  () => import("./pages/cooperative/CooperativeDetailPage"),
);
const EnterpriseTypePage = lazy(
  () => import("./pages/enterprise-type/EnterpriseTypePage"),
);
const EnterpriseFormPage = lazy(
  () => import("./pages/enterprise-form/EnterpriseFormPage"),
);
const EnterpriseCertificatePage = lazy(
  () => import("./pages/enterprise-certificate/EnterpriseCertificatePage"),
);
const EnterpriseCertificateFormPage = lazy(
  () => import("./pages/enterprise-certificate/EnterpriseCertificateFormPage"),
);
const MaterialGroupPage = lazy(
  () => import("./pages/material-group/MaterialGroupPage"),
);
const FertilizerGroupPage = lazy(
  () => import("./pages/fertilizer-group/FertilizerGroupPage"),
);
const PesticideGroupPage = lazy(
  () => import("./pages/pesticide-group/PesticideGroupPage"),
);
const LivestockMedicineGroupPage = lazy(
  () => import("./pages/livestock-medicine-group/LivestockMedicineGroupPage"),
);
const AquacultureMedicineGroupPage = lazy(
  () =>
    import("./pages/aquaculture-medicine-group/AquacultureMedicineGroupPage"),
);
const EquipmentGroupPage = lazy(
  () => import("./pages/equipment-group/EquipmentGroupPage"),
);
const AnimalHusbandryRegionPage = lazy(
  () =>
    import("./pages/animal-husbandry-zone/animal-husbandry-region/AnimalHusbandryRegionPage"),
);
const AnimalHusbandryRegionCreatePage = lazy(
  () =>
    import("./pages/animal-husbandry-zone/animal-husbandry-region/AnimalHusbandryRegionCreatePage"),
);
const AnimalHusbandryRegionDetailPage = lazy(
  () =>
    import("./pages/animal-husbandry-zone/animal-husbandry-region/AnimalHusbandryRegionDetailPage"),
);
const AnimalHusbandryRegionWorkflowPage = lazy(
  () =>
    import("./pages/animal-husbandry-zone/animal-husbandry-region/AnimalHusbandryRegionWorkflowPage"),
);
const AnimalHusbandrySearchZonePage = lazy(
  () => import("./pages/animal-husbandry-zone/search-zone/SearchZonePage"),
);

const PlantIdentificationListPage = lazy(
  () =>
    import("./pages/cultivation-zone/cultivation-region/PlantIdentificationListPage"),
);

const AnimalIdentificationSearchFarmPage = lazy(
  () =>
    import("./pages/animal-husbandry-zone/animal-identification/AnimalIdentificationSearchFarmPage"),
);

const AnimalIdentificationListPage = lazy(
  () =>
    import("./pages/animal-husbandry-zone/animal-identification/AnimalIdentificationListPage"),
);
const AnimalIdentificationCreatePage = lazy(
  () =>
    import("./pages/animal-husbandry-zone/animal-identification/AnimalIdentificationCreatePage"),
);
const AnimalIdentificationDetailPage = lazy(
  () =>
    import("./pages/animal-husbandry-zone/animal-identification/AnimalIdentificationDetailPage"),
);
const AnimalIdentificationEditPage = lazy(
  () =>
    import("./pages/animal-husbandry-zone/animal-identification/AnimalIdentificationEditPage"),
);

const AnimalDistributionListPage = lazy(
  () =>
    import("./pages/animal-husbandry-zone/animal-distribution-detail/AnimalDistributionListPage"),
);
const AnimalDistributionCreatePage = lazy(
  () =>
    import("./pages/animal-husbandry-zone/animal-distribution-detail/AnimalDistributionCreatePage"),
);
const AnimalDistributionDetailPage = lazy(
  () =>
    import("./pages/animal-husbandry-zone/animal-distribution-detail/AnimalDistributionDetailPage"),
);

const AnimalGrowthCyclePage = lazy(
  () =>
    import("./pages/animal-husbandry-zone/animal-growth-cycle/AnimalGrowthCyclePage"),
);
const AnimalGrowthCycleDetailPage = lazy(
  () =>
    import("./pages/animal-husbandry-zone/animal-growth-cycle/AnimalGrowthCycleDetailPage"),
);
const CreateAnimalGrowthCyclePage = lazy(
  () =>
    import("./pages/animal-husbandry-zone/animal-growth-cycle/CreateAnimalGrowthCyclePage"),
);
const UpdateAnimalGrowthCyclePage = lazy(
  () =>
    import("./pages/animal-husbandry-zone/animal-growth-cycle/UpdateAnimalGrowthCyclePage"),
);
const AnimalGrowthCycleWorkflowPage = lazy(
  () =>
    import("./pages/animal-husbandry-zone/animal-growth-cycle/AnimalGrowthCycleWorkflowPage"),
);
const PlantIdentificationDetailPage = lazy(
  () =>
    import("./pages/cultivation-zone/cultivation-region/PlantIdentificationDetailPage"),
);
const PlantIdentificationCreatePage = lazy(
  () =>
    import("./pages/cultivation-zone/cultivation-region/PlantIdentificationCreatePage"),
);
const PlantIdentificationEditPage = lazy(
  () =>
    import("./pages/cultivation-zone/cultivation-region/PlantIdentificationEditPage"),
);
const CultivationAreaPage = lazy(
  () => import("./pages/cultivation-area/CultivationAreaPage"),
);
const CultivationAreaCreatePage = lazy(
  () => import("./pages/cultivation-area/CultivationAreaCreatePage"),
);
const CultivationAreaDetailPage = lazy(
  () => import("./pages/cultivation-area/CultivationAreaDetailPage"),
);
const CultivationPlotPage = lazy(
  () => import("./pages/cultivation-plot/CultivationPlotPage"),
);
const CultivationPlotCreatePage = lazy(
  () => import("./pages/cultivation-plot/CultivationPlotCreatePage"),
);
const CultivationPlotDetailPage = lazy(
  () => import("./pages/cultivation-plot/CultivationPlotDetailPage"),
);
const MaterialLookupPage = lazy(
  () => import("./pages/material-lookup/MaterialLookupPage"),
);
const ProductionCultivationReportPage = lazy(
  () =>
    import("./pages/production-cultivation-report/ProductionCultivationReportPage"),
);
const TreatmentReportPage = lazy(
  () => import("./pages/treatment-report/TreatmentReportPage"),
);
const InternalReportPage = lazy(
  () => import("./pages/reports/InternalReportPage"),
);
const FarmerReportPage = lazy(() => import("./pages/reports/FarmerReportPage"));
const ProvincePage = lazy(() => import("./pages/province/ProvincePage"));
const LandSpecsPage = lazy(() => import("./pages/land-specs/LandSpecsPage"));
const TaskCategoryPage = lazy(
  () => import("./pages/task-category/TaskCategoryPage"),
);

const AnimalGrowthCycleDetailRoute = () => <AnimalGrowthCycleDetailPage />;
const AquacultureRegionWorkflowRoute = () => <AquacultureRegionWorkflowPage />;
const PlanGrowthRoute = () => <PlanGrowthPage />;
const PlanGrowthCreateRoute = () => <PlanGrowthCreatePage />;
const PlanGrowthCreateWorkflowRoute = () => <PlanGrowthCreateWorkflowPage />;
const PlanGrowthWorkflowPlansRoute = () => <PlanGrowthWorkflowPlansPage />;
const PlanGrowthWorkflowPlanEditRoute = () => {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const { data: planDetail } = useFarmPlanById(params.id ?? "", {
    enabled: Boolean(params.id),
  });
  const backToWorkflow = () => {
    const workflowId = planDetail?.workflow?.id;
    setLocation(
      workflowId
        ? `/plan-growth/create/workflow/${workflowId}`
        : "/plan-growth/create/workflow",
    );
  };
  return (
    <PlanGrowthEditPage
      basePath="/plan-growth/create/workflow"
      onSaved={backToWorkflow}
      onCancel={backToWorkflow}
    />
  );
};
const PlanGrowthWorkflowStageEditRoute = () => (
  <PlanGrowthWorkflowStageEditPage />
);
const PlanGrowthWorkflowDetailEditRoute = () => (
  <PlanGrowthWorkflowDetailEditPage />
);
const PlanGrowthWorkflowInfoFormRoute = () => (
  <PlanGrowthWorkflowInfoFormPage />
);
const PlanGrowthWorkflowRoute = () => <PlanGrowthWorkflowPage />;
const PlanGrowthEditRoute = () => <PlanGrowthEditPage />;
const PlanGrowthDetailRoute = () => <PlanGrowthDetailPage />;
const PlanAnimalGrowthRoute = () => <PlanAnimalGrowthPage />;
const PlanAnimalGrowthCreateRoute = () => <PlanAnimalGrowthCreatePage />;
const PlanAnimalGrowthCreateWorkflowRoute = () => (
  <PlanAnimalGrowthCreateWorkflowPage />
);
const PlanAnimalGrowthWorkflowPlanEditRoute = () => {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const { data: planDetail } = useFarmPlanById(params.id ?? "", {
    enabled: Boolean(params.id),
  });
  const backToWorkflow = () => {
    const workflowId = planDetail?.workflow?.id;
    setLocation(
      workflowId
        ? `/plan-animal-growth/create/workflow/${workflowId}`
        : "/plan-animal-growth/create/workflow",
    );
  };
  return (
    <PlanAnimalGrowthEditPage
      basePath="/plan-animal-growth/create/workflow"
      onSaved={backToWorkflow}
      onCancel={backToWorkflow}
    />
  );
};
const PlanAnimalGrowthWorkflowStageEditRoute = () => (
  <PlanAnimalGrowthWorkflowStageEditPage />
);
const PlanAnimalGrowthWorkflowDetailEditRoute = () => (
  <PlanAnimalGrowthWorkflowDetailEditPage />
);
const PlanAnimalGrowthWorkflowInfoFormRoute = () => (
  <PlanAnimalGrowthWorkflowInfoFormPage />
);
const PlanAnimalGrowthWorkflowRoute = () => <PlanAnimalGrowthWorkflowPage />;
const PlanAnimalGrowthWorkflowPlansRoute = () => (
  <PlanAnimalGrowthWorkflowPlansPage />
);
const PlanAnimalGrowthEditRoute = () => {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    if (params.id) {
      setLocation(`/plan-animal-growth/create/workflow/plan/${params.id}/edit`);
    }
  }, [params.id, setLocation]);

  return null;
};
const PlanAnimalGrowthDetailRoute = () => <PlanAnimalGrowthDetailPage />;
const PlanAquacultureGrowthRoute = () => <PlanAquacultureGrowthPage />;
const PlanAquacultureGrowthCreateRoute = () => (
  <PlanAquacultureGrowthCreatePage />
);
const PlanAquacultureGrowthCreateWorkflowRoute = () => (
  <PlanAquacultureGrowthCreateWorkflowPage />
);
const PlanAquacultureGrowthWorkflowPlanEditRoute = () => {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const { data: planDetail } = useFarmPlanById(params.id ?? "", {
    enabled: Boolean(params.id),
  });
  const backToWorkflow = () => {
    const workflowId = planDetail?.workflow?.id;
    setLocation(
      workflowId
        ? `/plan-aquaculture-growth/create/workflow/${workflowId}`
        : "/plan-aquaculture-growth/create/workflow",
    );
  };
  return (
    <PlanAquacultureGrowthEditPage
      basePath="/plan-aquaculture-growth/create/workflow"
      onSaved={backToWorkflow}
      onCancel={backToWorkflow}
    />
  );
};
const PlanAquacultureGrowthWorkflowStageEditRoute = () => (
  <PlanAquacultureGrowthWorkflowStageEditPage />
);
const PlanAquacultureGrowthWorkflowDetailEditRoute = () => (
  <PlanAquacultureGrowthWorkflowDetailEditPage />
);
const PlanAquacultureGrowthWorkflowInfoFormRoute = () => (
  <PlanAquacultureGrowthWorkflowInfoFormPage />
);
const PlanAquacultureGrowthWorkflowRoute = () => (
  <PlanAquacultureGrowthWorkflowPage />
);
const PlanAquacultureGrowthWorkflowPlansRoute = () => (
  <PlanAquacultureGrowthWorkflowPlansPage />
);
const PlanAquacultureGrowthEditRoute = () => {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    if (params.id) {
      setLocation(
        `/plan-aquaculture-growth/create/workflow/plan/${params.id}/edit`,
      );
    }
  }, [params.id, setLocation]);

  return null;
};
const PlanAquacultureGrowthDetailRoute = () => (
  <PlanAquacultureGrowthDetailPage />
);

function RootRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/dashboard", { replace: true });
  }, [setLocation]);

  return null;
}

function ReportsRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/reports/crops/overview", { replace: true });
  }, [setLocation]);

  return null;
}

function Router() {
  return (
    <ReportProvider>
      <Switch>
        <Route path="/" component={RootRedirect} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/terrain" component={TerrainPage} />
        <Route path="/land-specs" component={LandSpecsPage} />
        <Route path="/task-category" component={TaskCategoryPage} />
        <Route path="/province" component={ProvincePage} />
        <Route path="/land" component={LandPage} />
        <Route path="/farming-method" component={FarmingMethodPage} />
        <Route path="/farming-method-crop" component={FarmingMethodCropPage} />
        <Route path="/certificate" component={CertificatePage} />
        <Route path="/enterprise-type" component={EnterpriseTypePage} />
        <Route path="/enterprise-form" component={EnterpriseFormPage} />
        <Route
          path="/enterprise-certificate"
          component={EnterpriseCertificatePage}
        />
        <Route
          path="/enterprise-certificate/create"
          component={EnterpriseCertificateFormPage}
        />
        <Route
          path="/enterprise-certificate/:id/edit"
          component={EnterpriseCertificateFormPage}
        />
        <Route path="/enterprise" component={EnterprisePage} />
        <Route path="/enterprise/create" component={EnterpriseCreatePage} />
        <Route path="/enterprise/:id" component={EnterpriseDetailPage} />
        <Route path="/enterprise/:id/edit" component={EnterpriseEditPage} />
        <Route path="/branch" component={BranchPage} />
        <Route path="/branch/create" component={BranchFormPage} />
        <Route path="/branch/:id/edit" component={BranchFormPage} />
        <Route path="/branch/:id/detail" component={BranchDetailPage} />
        <Route path="/bank" component={BankPage} />
        <Route path="/bank-directory" component={BankDirectoryPage} />
        <Route path="/bank/create" component={BankCreatePage} />
        <Route path="/bank/:id/edit" component={BankEditPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/contact/create" component={ContactCreatePage} />
        <Route path="/contact/:id/edit" component={ContactEditPage} />
        <Route path="/department" component={DepartmentPage} />
        <Route path="/owner-department" component={OwnerDepartmentPage} />
        <Route path="/group-position" component={GroupPositionPage} />
        <Route path="/position" component={PositionPage} />
        <Route path="/owner-position" component={OwnerPositionPage} />
        <Route path="/position/:id/detail" component={PositionDetailPage} />
        <Route
          path="/owner-position/:id/detail"
          component={OwnerPositionDetailPage}
        />
        <Route path="/personnel" component={PersonnelPage} />
        <Route path="/personnel/create" component={PersonnelCreatePage} />
        <Route path="/personnel/:id/edit" component={PersonnelEditPage} />
        <Route path="/team" component={TeamPage} />
        <Route path="/team/create" component={TeamCreatePage} />
        <Route path="/team/:id/edit" component={TeamEditPage} />
        <Route path="/team/:id" component={TeamDetailPage} />
        {/* Old routes kept for safety, though removed from sidebar */}
        <Route path="/geo-zone" component={GeoZonePage} />
        {/* Region Chart Routes */}
        <Route path="/region-distribution" component={RegionDistributionPage} />
        <Route
          path="/region-distribution/create"
          component={RegionCreatePage}
        />
        <Route
          path="/region-distribution/detail/:id"
          component={RegionDetailPage}
        />
        <Route
          path="/region-distribution/edit/:id"
          component={RegionCreatePage}
        />
        <Route path="/area-distribution" component={AreaDistributionPage} />
        <Route
          path="/area-distribution/detail/:id"
          component={AreaDetailPage}
        />
        <Route path="/area-distribution/create" component={AreaCreatePage} />
        <Route path="/area-distribution/edit/:id" component={AreaCreatePage} />
        <Route path="/plot-distribution" component={PlotDistributionPage} />
        <Route path="/plot-distribution/create" component={PlotCreatePage} />
        <Route path="/plot-distribution/edit/:id" component={PlotCreatePage} />
        <Route
          path="/plot-distribution/detail/:id"
          component={PlotDetailPage}
        />
        {/* Legacy aliases */}
        <Route
          path="/region-chart/plot-distribution"
          component={PlotDistributionPage}
        />
        <Route
          path="/region-chart/plot-distribution/create"
          component={PlotCreatePage}
        />
        <Route
          path="/region-chart/plot-distribution/edit/:id"
          component={PlotCreatePage}
        />
        <Route
          path="/region-chart/plot-distribution/detail/:id"
          component={PlotDetailPage}
        />
        <Route path="/map-view" component={MapViewPage} />
        <Route
          path="/legal-identification"
          component={LegalIdentificationPage}
        />
        <Route
          path="/legal-identification/create"
          component={LegalIdentificationCreateEditPage}
        />
        <Route
          path="/legal-identification/:id/edit"
          component={LegalIdentificationCreateEditPage}
        />
        <Route
          path="/legal-identification/:id"
          component={LegalIdentificationDetailPage}
        />
        <Route
          path="/cultivation-region-identification/crop"
          component={RegionBasicDistributionPage}
        />
        <Route
          path="/cultivation-region-identification/crop/create"
          component={RegionBasicDistributionCreateEditPage}
        />
        <Route
          path="/cultivation-region-identification/crop/edit/:id"
          component={RegionBasicDistributionCreateEditPage}
        />
        <Route
          path="/cultivation-region-identification/crop/detail/:id"
          component={RegionBasicDistributionDetailPage}
        />
        {/* Livestock (Animal) Basic Identification Routes */}
        <Route
          path="/cultivation-region-identification/animal"
          component={RegionBasicDistributionLivestockPage}
        />
        <Route
          path="/cultivation-region-identification/animal/create"
          component={RegionBasicDistributionLivestockCreateEditPage}
        />
        <Route
          path="/cultivation-region-identification/animal/edit/:id"
          component={RegionBasicDistributionLivestockCreateEditPage}
        />
        <Route
          path="/cultivation-region-identification/animal/detail/:id"
          component={RegionBasicDistributionLivestockDetailPage}
        />
        {/* Aquaculture Basic Identification Routes */}
        <Route
          path="/cultivation-region-identification/aquaculture"
          component={RegionBasicDistributionAquaculturePage}
        />
        <Route
          path="/cultivation-region-identification/aquaculture/create"
          component={RegionBasicDistributionAquacultureCreateEditPage}
        />
        <Route
          path="/cultivation-region-identification/aquaculture/edit/:id"
          component={RegionBasicDistributionAquacultureCreateEditPage}
        />
        <Route
          path="/cultivation-region-identification/aquaculture/detail/:id"
          component={RegionBasicDistributionAquacultureDetailPage}
        />
        <Route path="/soil-amendment-map" component={SoilAmendmentMapPage} />
        <Route
          path="/soil-amendment-treatment"
          component={SoilAmendmentTreatmentPage}
        />
        <Route path="/amendment-cycle" component={AmendmentCyclePage} />
        <Route path="/amendment-method" component={AmendmentMethodPage} />
        <Route path="/amendment-plan" component={AmendmentPlanPage} />
        <Route
          path="/amendment-plan/create"
          component={AmendmentPlanCreatePage}
        />
        <Route
          path="/amendment-plan/:id/edit"
          component={AmendmentPlanCreatePage}
        />
        <Route path="/amendment-task" component={AmendmentTaskPage} />
        {/* Cultivation Zone Sub-Routes */}
        <Route path="/cultivation-region" component={CultivationRegionPage} />
        <Route
          path="/cultivation-region/create"
          component={CultivationRegionCreatePage}
        />
        <Route
          path="/cultivation-region/:id"
          component={CultivationRegionDetailPage}
        />
        <Route
          path="/cultivation-region/:id/workflow"
          component={CultivationRegionWorkflowPage}
        />
        <Route
          path="/cultivation-region/:id/edit"
          component={CultivationRegionCreatePage}
        />

        {/* Animal Husbandry Zone Sub-Routes */}
        <Route
          path="/animal-husbandry-region"
          component={AnimalHusbandryRegionPage}
        />
        <Route
          path="/animal-husbandry-region/create"
          component={AnimalHusbandryRegionCreatePage}
        />
        <Route
          path="/animal-husbandry-region/search"
          component={AnimalHusbandrySearchZonePage}
        />
        <Route
          path="/animal-husbandry-region/:id"
          component={AnimalHusbandryRegionDetailPage}
        />
        <Route
          path="/animal-husbandry-region/:id/workflow"
          component={AnimalHusbandryRegionWorkflowPage}
        />
        <Route
          path="/animal-husbandry-region/:id/edit"
          component={AnimalHusbandryRegionCreatePage}
        />

        <Route
          path="/animal-identification"
          component={AnimalIdentificationListPage}
        />
        <Route
          path="/animal-identification/create"
          component={AnimalIdentificationCreatePage}
        />
        <Route
          path="/animal-identification/search"
          component={AnimalIdentificationSearchFarmPage}
        />
        <Route
          path="/animal-identification/search-farm"
          component={AnimalHusbandrySearchZonePage}
        />
        <Route
          path="/animal-identification/:id"
          component={AnimalIdentificationDetailPage}
        />
        <Route
          path="/animal-identification/:id/edit"
          component={AnimalIdentificationEditPage}
        />
        <Route
          path="/animal-distribution-detail"
          component={AnimalDistributionListPage}
        />
        <Route
          path="/animal-distribution-detail/create"
          component={AnimalDistributionCreatePage}
        />
        <Route
          path="/animal-distribution-detail/:id"
          component={AnimalDistributionDetailPage}
        />
        <Route
          path="/animal-distribution-detail/:id/edit"
          component={AnimalDistributionCreatePage}
        />

        <Route path="/animal-growth-cycle" component={AnimalGrowthCyclePage} />
        <Route
          path="/animal-growth-cycle/create"
          component={CreateAnimalGrowthCyclePage}
        />
        <Route
          path="/animal-growth-cycle/:id"
          component={AnimalGrowthCycleDetailRoute}
        />
        <Route
          path="/animal-growth-cycle/:id/edit"
          component={UpdateAnimalGrowthCyclePage}
        />
        <Route
          path="/animal-growth-cycle/:id/workflow"
          component={AnimalGrowthCycleWorkflowPage}
        />

        <Route path="/aquaculture-region" component={AquacultureRegionPage} />
        <Route
          path="/aquaculture-region/create"
          component={AquacultureRegionCreatePage}
        />
        <Route
          path="/aquaculture-region/:id"
          component={AquacultureRegionDetailPage}
        />
        <Route
          path="/aquaculture-region/:id/workflow"
          component={AquacultureRegionWorkflowRoute}
        />
        <Route
          path="/aquaculture-region/:id/edit"
          component={AquacultureRegionCreatePage}
        />
        <Route
          path="/distribution-detail"
          component={PlantDistributionListPage}
        />
        <Route
          path="/distribution-detail/create"
          component={PlantDistributionCreatePage}
        />
        <Route
          path="/distribution-detail/:id"
          component={DistributionDetailPage}
        />
        <Route
          path="/distribution-detail/:id/edit"
          component={PlantDistributionCreatePage}
        />
        <Route
          path="/aquaculture-distribution-detail"
          component={AquacultureDistributionListPage}
        />
        <Route
          path="/aquaculture-distribution-detail/create"
          component={AquacultureDistributionCreatePage}
        />
        <Route
          path="/aquaculture-distribution-detail/:id"
          component={AquacultureDistributionDetailPage}
        />
        {/* Cultivation Area Routes */}
        <Route path="/cultivation-area" component={CultivationAreaPage} />
        <Route
          path="/cultivation-area/create"
          component={CultivationAreaCreatePage}
        />
        <Route
          path="/cultivation-area/:id/edit"
          component={CultivationAreaCreatePage}
        />
        <Route
          path="/cultivation-area/:id"
          component={CultivationAreaDetailPage}
        />
        {/* Cultivation Plot Routes */}
        <Route path="/cultivation-plot" component={CultivationPlotPage} />
        <Route
          path="/cultivation-plot/create"
          component={CultivationPlotCreatePage}
        />
        <Route
          path="/cultivation-plot/:id/edit"
          component={CultivationPlotCreatePage}
        />
        <Route
          path="/cultivation-plot/:id"
          component={CultivationPlotDetailPage}
        />
        <Route path="/treatment" component={TreatmentPage} />
        <Route path="/search-crop" component={SearchCropPage} />
        <Route path="/search-zone" component={SearchZonePage} />
        <Route
          path="/aquaculture-search-farm"
          component={AquacultureSearchFarmPage}
        />
        <Route path="/search-unit" component={SearchUnitPage} />
        <Route path="/lookup-material" component={MaterialLookupPage} />
        <Route
          path="/plant-identification"
          component={PlantIdentificationListPage}
        />
        <Route
          path="/plant-identification/create"
          component={PlantIdentificationCreatePage}
        />
        <Route
          path="/plant-identification/:id"
          component={PlantIdentificationDetailPage}
        />
        <Route
          path="/plant-identification/:id/edit"
          component={PlantIdentificationEditPage}
        />
        <Route
          path="/aquaculture-identification"
          component={AquacultureIdentificationListPage}
        />
        <Route
          path="/aquaculture-identification/create"
          component={AquacultureIdentificationCreatePage}
        />
        <Route
          path="/aquaculture-identification/search"
          component={AquacultureIdentificationSearchPage}
        />
        <Route
          path="/aquaculture-identification/:id"
          component={AquacultureIdentificationDetailPage}
        />
        <Route
          path="/aquaculture-identification/:id/edit"
          component={AquacultureIdentificationEditPage}
        />
        <Route path="/crop" component={CropPage} />
        <Route path="/crop/create" component={CropCreatePage} />
        <Route path="/crop/:id" component={CropDetailPage} />
        <Route path="/crop-foundation" component={CropFoundationPage} />
        <Route
          path="/crop-foundation/create"
          component={CropFoundationCreatePage}
        />
        <Route
          path="/crop-foundation/:id/edit"
          component={CropFoundationEditPage}
        />
        <Route
          path="/crop-foundation/:id"
          component={CropFoundationDetailPage}
        />
        <Route path="/document-category" component={DocumentCategoryListPage} />
        <Route
          path="/document-category/create"
          component={DocumentCategoryCreatePage}
        />
        <Route
          path="/document-category/:id/edit"
          component={DocumentCategoryEditPage}
        />
        <Route
          path="/document-category/:id"
          component={DocumentCategoryDetailPage}
        />
        <Route path="/group-crop" component={GroupCropPage} />
        <Route path="/group-livestock" component={GroupLivestockPage} />
        <Route path="/group-aqua" component={GroupAquaPage} />
        <Route path="/docs" component={DocsPage} />
        <Route path="/docs/create" component={CreateDocsPage} />
        <Route path="/docs/update/:id" component={UpdateDocsPage} />
        <Route path="/docs/:id" component={DocsDetailPage} />
        <Route path="/variety" component={VarietyPage} />
        <Route path="/variety/create" component={CreateVarietyPage} />
        <Route path="/variety-foundation" component={VarietyFoundationPage} />
        <Route
          path="/variety-foundation/create"
          component={CreateVarietyFoundationPage}
        />
        <Route
          path="/variety-foundation/:id/edit"
          component={VarietyFoundationEditPage}
        />
        {/* <Route path="/variety/:id">
        {(params) => <VarietyDetailPage id={params.id} />}
      </Route> */}
        <Route path="/variety/:id/edit" component={VarietyEditPage} />
        <Route path="/seed" component={SeedPage} />
        <Route path="/seed/create" component={CreateSeedPage} />
        <Route path="/seed/:id/edit" component={UpdateSeedPage} />
        <Route path="/seed/:id" component={SeedDetailPage} />
        <Route path="/growth-cycle" component={GrowthCyclePage} />
        <Route
          path="/aquaculture-growth-cycle"
          component={AquacultureGrowthCyclePage}
        />
        <Route
          path="/aquaculture-growth-cycle/create"
          component={CreateAquacultureGrowthCyclePage}
        />
        <Route
          path="/aquaculture-growth-cycle/:id/edit"
          component={AquacultureGrowthCycleEditPage}
        />
        <Route path="/growth-cycle/create" component={CreateGrowthCyclePage} />
        <Route
          path="/growth-cycle/:id/workflow"
          component={GrowthCycleWorkflowPage}
        />
        <Route
          path="/growth-cycle/:id/edit"
          component={UpdateGrowthCyclePage}
        />
        <Route path="/season" component={SeasonPage} />
        <Route path="/season/create" component={CreateSeasonPage} />
        <Route path="/season/:id/edit" component={UpdateSeasonPage} />
        <Route path="/season/:id" component={SeasonDetailPage} />
        <Route
          path="/cultivation-material/pesticide"
          component={PesticidePage}
        />
        <Route path="/pesticide-group" component={PesticideGroupPage} />
        <Route
          path="/livestock-medicine-group"
          component={LivestockMedicineGroupPage}
        />
        <Route
          path="/aquaculture-medicine-group"
          component={AquacultureMedicineGroupPage}
        />
        <Route
          path="/cultivation-material/pesticide/create"
          component={PesticideCreatePage}
        />
        <Route
          path="/cultivation-material/pesticide/:id/edit"
          component={PesticideCreatePage}
        />
        <Route
          path="/cultivation-material/pesticide/:id"
          component={PesticideDetailPage}
        />
        <Route
          path="/cultivation-material/fertilizer"
          component={FertilizerPage}
        />
        <Route path="/fertilizer-group" component={FertilizerGroupPage} />
        <Route
          path="/cultivation-material/fertilizer/create"
          component={FertilizerCreatePage}
        />
        <Route
          path="/cultivation-material/fertilizer/:id/edit"
          component={FertilizerCreatePage}
        />
        <Route
          path="/cultivation-material/fertilizer/:id"
          component={FertilizerDetailPage}
        />
        <Route path="/cultivation-material/material" component={MaterialPage} />
        <Route path="/material-group" component={MaterialGroupPage} />
        <Route
          path="/cultivation-material/material/create"
          component={MaterialCreatePage}
        />
        <Route
          path="/cultivation-material/material/:id/edit"
          component={MaterialCreatePage}
        />
        <Route
          path="/cultivation-material/material/:id"
          component={MaterialDetailPage}
        />

        <Route
          path="/cultivation-material/equipment"
          component={EquipmentPage}
        />
        <Route path="/vehicle-group" component={EquipmentGroupPage} />
        <Route
          path="/cultivation-material/equipment/create"
          component={EquipmentCreatePage}
        />
        <Route
          path="/cultivation-material/equipment/:id/edit"
          component={EquipmentCreatePage}
        />
        <Route
          path="/cultivation-material/equipment/:id"
          component={EquipmentDetailPage}
        />

        {/* Admin Master Data Supply Routes */}
        <Route path="/admin/material" component={MaterialPage} />
        <Route path="/admin/material/create" component={MaterialCreatePage} />
        <Route path="/admin/material/:id/edit" component={MaterialCreatePage} />
        <Route path="/admin/material/:id" component={MaterialDetailPage} />

        <Route path="/admin/pesticide" component={PesticidePage} />
        <Route path="/admin/pesticide/create" component={PesticideCreatePage} />
        <Route
          path="/admin/pesticide/:id/edit"
          component={PesticideCreatePage}
        />
        <Route path="/admin/pesticide/:id" component={PesticideDetailPage} />

        <Route path="/admin/fertilizer" component={FertilizerPage} />
        <Route
          path="/admin/fertilizer/create"
          component={FertilizerCreatePage}
        />
        <Route
          path="/admin/fertilizer/:id/edit"
          component={FertilizerCreatePage}
        />
        <Route path="/admin/fertilizer/:id" component={FertilizerDetailPage} />

        <Route path="/admin/equipment" component={EquipmentPage} />
        <Route path="/admin/equipment/create" component={EquipmentCreatePage} />
        <Route
          path="/admin/equipment/:id/edit"
          component={EquipmentCreatePage}
        />
        <Route path="/admin/equipment/:id" component={EquipmentDetailPage} />

        {/* Admin Master Data Supply Routes - Livestock */}
        <Route path="/admin/ah-material" component={AhMaterialPage} />
        <Route
          path="/admin/ah-material/create"
          component={AhMaterialCreatePage}
        />
        <Route
          path="/admin/ah-material/:id/edit"
          component={AhMaterialCreatePage}
        />
        <Route path="/admin/ah-material/:id" component={AhMaterialDetailPage} />

        <Route path="/admin/ah-pesticide" component={AhPesticidePage} />
        <Route
          path="/admin/ah-pesticide/create"
          component={AhPesticideCreatePage}
        />
        <Route
          path="/admin/ah-pesticide/:id/edit"
          component={AhPesticideCreatePage}
        />
        <Route
          path="/admin/ah-pesticide/:id"
          component={AhPesticideDetailPage}
        />

        <Route path="/admin/ah-equipment" component={AhEquipmentPage} />
        <Route
          path="/admin/ah-equipment/create"
          component={AhEquipmentCreatePage}
        />
        <Route
          path="/admin/ah-equipment/:id/edit"
          component={AhEquipmentCreatePage}
        />
        <Route
          path="/admin/ah-equipment/:id"
          component={AhEquipmentDetailPage}
        />

        {/* Admin Master Data Supply Routes - Aquaculture */}
        <Route path="/admin/aq-material" component={AqMaterialPage} />
        <Route
          path="/admin/aq-material/create"
          component={AqMaterialCreatePage}
        />
        <Route
          path="/admin/aq-material/:id/edit"
          component={AqMaterialCreatePage}
        />
        <Route path="/admin/aq-material/:id" component={AqMaterialDetailPage} />

        <Route path="/admin/aq-pesticide" component={AqPesticidePage} />
        <Route
          path="/admin/aq-pesticide/create"
          component={AqPesticideCreatePage}
        />
        <Route
          path="/admin/aq-pesticide/:id/edit"
          component={AqPesticideCreatePage}
        />
        <Route
          path="/admin/aq-pesticide/:id"
          component={AqPesticideDetailPage}
        />

        <Route path="/admin/aq-equipment" component={AqEquipmentPage} />
        <Route
          path="/admin/aq-equipment/create"
          component={AqEquipmentCreatePage}
        />
        <Route
          path="/admin/aq-equipment/:id/edit"
          component={AqEquipmentCreatePage}
        />
        <Route
          path="/admin/aq-equipment/:id"
          component={AqEquipmentDetailPage}
        />

        {/* Animal Husbandry Material Routes */}
        <Route
          path="/animal-husbandry-material/pesticide"
          component={AhPesticidePage}
        />
        <Route
          path="/animal-husbandry-material/pesticide/create"
          component={AhPesticideCreatePage}
        />
        <Route
          path="/animal-husbandry-material/pesticide/:id/edit"
          component={AhPesticideCreatePage}
        />
        <Route
          path="/animal-husbandry-material/pesticide/:id"
          component={AhPesticideDetailPage}
        />
        <Route
          path="/animal-husbandry-material/material"
          component={AhMaterialPage}
        />
        <Route
          path="/animal-husbandry-material/material/create"
          component={AhMaterialCreatePage}
        />
        <Route
          path="/animal-husbandry-material/material/:id/edit"
          component={AhMaterialCreatePage}
        />
        <Route
          path="/animal-husbandry-material/material/:id"
          component={AhMaterialDetailPage}
        />
        <Route
          path="/animal-husbandry-material/equipment"
          component={AhEquipmentPage}
        />
        <Route
          path="/animal-husbandry-material/equipment/create"
          component={AhEquipmentCreatePage}
        />
        <Route
          path="/animal-husbandry-material/equipment/:id/edit"
          component={AhEquipmentCreatePage}
        />
        <Route
          path="/animal-husbandry-material/equipment/:id"
          component={AhEquipmentDetailPage}
        />

        {/* Aquaculture Material Routes */}
        <Route
          path="/aquaculture-material/pesticide"
          component={AqPesticidePage}
        />
        <Route
          path="/aquaculture-material/pesticide/create"
          component={AqPesticideCreatePage}
        />
        <Route
          path="/aquaculture-material/pesticide/:id/edit"
          component={AqPesticideCreatePage}
        />
        <Route
          path="/aquaculture-material/pesticide/:id"
          component={AqPesticideDetailPage}
        />
        <Route
          path="/aquaculture-material/material"
          component={AqMaterialPage}
        />
        <Route
          path="/aquaculture-material/material/create"
          component={AqMaterialCreatePage}
        />
        <Route
          path="/aquaculture-material/material/:id/edit"
          component={AqMaterialCreatePage}
        />
        <Route
          path="/aquaculture-material/material/:id"
          component={AqMaterialDetailPage}
        />
        <Route
          path="/aquaculture-material/equipment"
          component={AqEquipmentPage}
        />
        <Route
          path="/aquaculture-material/equipment/create"
          component={AqEquipmentCreatePage}
        />
        <Route
          path="/aquaculture-material/equipment/:id/edit"
          component={AqEquipmentCreatePage}
        />
        <Route
          path="/aquaculture-material/equipment/:id"
          component={AqEquipmentDetailPage}
        />

        {/* Warehouse Routes */}
        <Route path="/inventory-area" component={InventoryAreaPage} />
        <Route
          path="/inventory-area/create"
          component={InventoryAreaCreatePage}
        />
        <Route
          path="/inventory-area/:id/edit"
          component={InventoryAreaCreatePage}
        />
        <Route
          path="/crop-material-inventory"
          component={CropMaterialInventoryPage}
        />
        <Route
          path="/livestock-material-inventory"
          component={LivestockMaterialInventoryPage}
        />
        <Route
          path="/aquaculture-material-inventory"
          component={AquacultureMaterialInventoryPage}
        />
        <Route path="/inventory-lookup" component={InventoryLookupPage} />
        <Route path="/inventory-in" component={InventoryInPage} />
        <Route path="/inventory-out" component={InventoryOutPage} />

        <Route path="/contract" component={ContractPage} />
        <Route path="/document-version" component={DocumentVersionPage} />
        <Route path="/role-responsibility" component={RoleResponsibilityPage} />
        <Route
          path="/role-responsibility/create"
          component={RoleResponsibilityFormPage}
        />
        <Route
          path="/role-responsibility/:id/edit"
          component={RoleResponsibilityFormPage}
        />
        <Route
          path="/role-responsibility/:id"
          component={RoleResponsibilityDetailPage}
        />
        <Route path="/contract/create" component={ContractCreatePage} />
        <Route path="/contract/:id/edit" component={ContractEditPage} />
        <Route path="/contract/:id" component={ContractDetailPage} />
        <Route path="/supply-conversion-rules" component={UnitPage} />
        <Route
          path="/supply-conversion-rules/create"
          component={UnitCreatePage}
        />
        <Route
          path="/supply-conversion-rules/:id/edit"
          component={UnitCreatePage}
        />
        <Route path="/plan-type" component={PlanTypePage} />
        <Route path="/plan" component={PlanPage} />
        <Route path="/plan/create" component={PlanCreatePage} />
        <Route path="/plan/:id/workflow" component={PlanWorkflowPage} />
        <Route path="/plan/:id/edit" component={PlanEditPage} />
        <Route path="/plan/:id" component={PlanDetailPage} />
        <Route path="/plan-growth" component={PlanGrowthRoute} />
        <Route
          path="/plan-growth/create/workflow/plan/:id/edit"
          component={PlanGrowthWorkflowPlanEditRoute}
        />
        <Route
          path="/plan-growth/create/workflow/stage/:nodeId/edit"
          component={PlanGrowthWorkflowStageEditRoute}
        />
        <Route
          path="/plan-growth/create/workflow/detail/:nodeId/edit"
          component={PlanGrowthWorkflowDetailEditRoute}
        />
        <Route
          path="/plan-growth/create/workflow/info/create"
          component={PlanGrowthWorkflowInfoFormRoute}
        />
        <Route
          path="/plan-growth/create/workflow/info/:nodeId/edit"
          component={PlanGrowthWorkflowInfoFormRoute}
        />
        <Route
          path="/plan-growth/create/workflow"
          component={PlanGrowthCreateWorkflowRoute}
        />
        <Route
          path="/plan-growth/create/workflow/:workflowId"
          component={PlanGrowthCreateWorkflowRoute}
        />
        <Route path="/plan-growth/create" component={PlanGrowthCreateRoute} />
        <Route
          path="/plan-growth/workflow/:workflowId"
          component={PlanGrowthWorkflowPlansRoute}
        />
        <Route
          path="/plan-growth/:id/workflow"
          component={PlanGrowthWorkflowRoute}
        />
        <Route path="/plan-growth/:id/edit" component={PlanGrowthEditRoute} />
        <Route path="/plan-growth/:id" component={PlanGrowthDetailRoute} />
        <Route path="/plan-animal-growth" component={PlanAnimalGrowthRoute} />
        <Route
          path="/plan-animal-growth/create/workflow/plan/:id/edit"
          component={PlanAnimalGrowthWorkflowPlanEditRoute}
        />
        <Route
          path="/plan-animal-growth/create/workflow/stage/:nodeId/edit"
          component={PlanAnimalGrowthWorkflowStageEditRoute}
        />
        <Route
          path="/plan-animal-growth/create/workflow/detail/:nodeId/edit"
          component={PlanAnimalGrowthWorkflowDetailEditRoute}
        />
        <Route
          path="/plan-animal-growth/create/workflow/info/create"
          component={PlanAnimalGrowthWorkflowInfoFormRoute}
        />
        <Route
          path="/plan-animal-growth/create/workflow/info/:nodeId/edit"
          component={PlanAnimalGrowthWorkflowInfoFormRoute}
        />
        <Route
          path="/plan-animal-growth/create/workflow"
          component={PlanAnimalGrowthCreateWorkflowRoute}
        />
        <Route
          path="/plan-animal-growth/create/workflow/:workflowId"
          component={PlanAnimalGrowthCreateWorkflowRoute}
        />
        <Route
          path="/plan-animal-growth/create"
          component={PlanAnimalGrowthCreateRoute}
        />
        <Route
          path="/plan-animal-growth/workflow/:workflowId"
          component={PlanAnimalGrowthWorkflowPlansRoute}
        />
        <Route
          path="/plan-animal-growth/:id/workflow"
          component={PlanAnimalGrowthWorkflowRoute}
        />
        <Route
          path="/plan-animal-growth/:id/edit"
          component={PlanAnimalGrowthEditRoute}
        />
        <Route
          path="/plan-animal-growth/:id"
          component={PlanAnimalGrowthDetailRoute}
        />
        <Route
          path="/plan-aquaculture-growth"
          component={PlanAquacultureGrowthRoute}
        />
        <Route
          path="/plan-aquaculture-growth/create/workflow/plan/:id/edit"
          component={PlanAquacultureGrowthWorkflowPlanEditRoute}
        />
        <Route
          path="/plan-aquaculture-growth/create/workflow/stage/:nodeId/edit"
          component={PlanAquacultureGrowthWorkflowStageEditRoute}
        />
        <Route
          path="/plan-aquaculture-growth/create/workflow/detail/:nodeId/edit"
          component={PlanAquacultureGrowthWorkflowDetailEditRoute}
        />
        <Route
          path="/plan-aquaculture-growth/create/workflow/info/create"
          component={PlanAquacultureGrowthWorkflowInfoFormRoute}
        />
        <Route
          path="/plan-aquaculture-growth/create/workflow/info/:nodeId/edit"
          component={PlanAquacultureGrowthWorkflowInfoFormRoute}
        />
        <Route
          path="/plan-aquaculture-growth/create/workflow"
          component={PlanAquacultureGrowthCreateWorkflowRoute}
        />
        <Route
          path="/plan-aquaculture-growth/create/workflow/:workflowId"
          component={PlanAquacultureGrowthCreateWorkflowRoute}
        />
        <Route
          path="/plan-aquaculture-growth/create"
          component={PlanAquacultureGrowthCreateRoute}
        />
        <Route
          path="/plan-aquaculture-growth/workflow/:workflowId"
          component={PlanAquacultureGrowthWorkflowPlansRoute}
        />
        <Route
          path="/plan-aquaculture-growth/:id/workflow"
          component={PlanAquacultureGrowthWorkflowRoute}
        />
        <Route
          path="/plan-aquaculture-growth/:id/edit"
          component={PlanAquacultureGrowthEditRoute}
        />
        <Route
          path="/plan-aquaculture-growth/:id"
          component={PlanAquacultureGrowthDetailRoute}
        />
        <Route
          path="/production-cultivation-report"
          component={ProductionCultivationReportPage}
        />
        <Route path="/treatment-report" component={TreatmentReportPage} />
        <Route
          path="/material-consumption-report"
          component={ReportsRedirect}
        />
        <Route path="/admin-farmer-report" component={AdminReportPage} />
        <Route path="/admin-report" component={AdminReportPage} />
        <Route path="/reports" component={ReportsRedirect} />
        <Route
          path="/reports/:domain/:module"
          component={ReportPageContainer}
        />
        <Route path="/task" component={TaskPage} />
        <Route path="/task/create" component={TaskCreatePage} />
        <Route path="/task/:id/edit" component={TaskEditPage} />
        {/* Keep after /task/create so ":id" does not swallow the literal route. */}
        <Route path="/task/:id" component={TaskDetailPage} />
        <Route path="/workspace" component={WorkspacePage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/treatment" component={TreatmentPage} />
        <Route path="/treatment/create" component={CreateTreatmentPage} />
        <Route path="/treatment/:id/edit" component={CreateTreatmentPage} />

        <Route path="/farmer" component={FarmerPage} />
        <Route path="/farmer/create" component={FarmerCreatePage} />
        <Route path="/farmer/:id/edit" component={FarmerEditPage} />
        <Route path="/farmer/:id" component={FarmerDetailPage} />

        <Route path="/cooperative" component={CooperativePage} />
        <Route path="/cooperative/create" component={CooperativeCreatePage} />
        <Route path="/cooperative/:id/edit" component={CooperativeEditPage} />
        <Route path="/cooperative/:id" component={CooperativeDetailPage} />

        {/* IoT Device Management Routes */}
        <Route path="/iot-device" component={IoTDevicePage} />
        <Route path="/iot-device-group" component={IoTDeviceGroupPage} />
        <Route path="/irrigation-systems" component={IrrigationSystemPage} />
        <Route path="/iot-device/create" component={IoTDeviceCreatePage} />
        <Route path="/iot-device/:id/edit" component={IoTDeviceCreatePage} />
        <Route path="/iot-device/:id" component={IoTDeviceDetailPage} />
        <Route path="/map-iot-device" component={IoTMapViewPage} />

        {/* History Routes */}
        <Route path="/history" component={HistoryPage} />
        <Route path="/diary/incident" component={HistoryCreatePage} />
        <Route path="/diary/plan/:taskId" component={PlanDiaryDetailPage} />
        <Route path="/diary/plan" component={PlanDiaryPage} />
        <Route path="/diary/update" component={UpdateHistoryPage} />

        <Route component={NotFoundPage} />
      </Switch>
    </ReportProvider>
  );
}

function AppRouter() {
  return <Router />;
}

export default AppRouter;
