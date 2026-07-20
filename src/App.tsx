import { Route, Switch, useLocation } from "wouter";
import { lazy, Suspense, useEffect } from "react";
import { AppLoadingState } from "./components/AppLoadingState";
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

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
import {
  RadixToaster,
  TooltipProvider,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AuthWrapper } from "./features/auth/components/AuthWrapper";
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
const CultivationRegionCreatePage = lazy(
  () =>
    import("./pages/cultivation-zone/cultivation-region/CultivationRegionCreatePage"),
);
const DistributionDetailPage = lazy(
  () =>
    import("./pages/cultivation-zone/distribution-detail/DistributionDetailPage"),
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
const SearchUnitPage = lazy(
  () => import("./pages/enterprise/search-unit/SearchUnitPage"),
);

const SeedPage = lazy(() => import("./pages/seed/SeedPage"));
const GrowthCyclePage = lazy(
  () => import("./pages/growth-cycle/GrowthCyclePage"),
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
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));
const WorkspacePage = lazy(() => import("./pages/workspace/WorkspacePage"));
const RegionDetailPage = lazy(
  () => import("./pages/region-chart/region-distribution/RegionDetailPage"),
);
const CultivationRegionDetailPage = lazy(
  () =>
    import("./pages/cultivation-zone/cultivation-region/CultivationRegionDetailPage"),
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
const EquipmentGroupPage = lazy(
  () => import("./pages/equipment-group/EquipmentGroupPage"),
);
const PlantIdentificationListPage = lazy(
  () =>
    import("./pages/cultivation-zone/cultivation-region/PlantIdentificationListPage"),
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
const ProvincePage = lazy(() => import("./pages/province/ProvincePage"));
const LandSpecsPage = lazy(() => import("./pages/land-specs/LandSpecsPage"));

function RootRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/workspace", { replace: true });
  }, [setLocation]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RootRedirect} />
      <Route path="/terrain" component={TerrainPage} />
      <Route path="/land-specs" component={LandSpecsPage} />
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
      <Route path="/region-distribution/create" component={RegionCreatePage} />
      <Route
        path="/region-distribution/detail/:id"
        component={RegionDetailPage}
      />
      <Route
        path="/region-distribution/edit/:id"
        component={RegionCreatePage}
      />
      <Route path="/area-distribution" component={AreaDistributionPage} />
      <Route path="/area-distribution/detail/:id" component={AreaDetailPage} />
      <Route path="/area-distribution/create" component={AreaCreatePage} />
      <Route path="/area-distribution/edit/:id" component={AreaCreatePage} />
      <Route path="/plot-distribution" component={PlotDistributionPage} />
      <Route path="/plot-distribution/create" component={PlotCreatePage} />
      <Route path="/plot-distribution/edit/:id" component={PlotCreatePage} />
      <Route path="/plot-distribution/detail/:id" component={PlotDetailPage} />
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
      <Route path="/legal-identification" component={LegalIdentificationPage} />
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
        path="/cultivation-region/:id/edit"
        component={CultivationRegionCreatePage}
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
      <Route path="/crop-foundation/:id" component={CropFoundationDetailPage} />
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
      <Route path="/growth-cycle/create" component={CreateGrowthCyclePage} />
      <Route
        path="/growth-cycle/:id/workflow"
        component={GrowthCycleWorkflowPage}
      />
      <Route path="/growth-cycle/:id/edit" component={UpdateGrowthCyclePage} />
      <Route path="/season" component={SeasonPage} />
      <Route path="/season/create" component={CreateSeasonPage} />
      <Route path="/season/:id/edit" component={UpdateSeasonPage} />
      <Route path="/season/:id" component={SeasonDetailPage} />
      <Route path="/pesticide" component={PesticidePage} />
      <Route path="/pesticide-group" component={PesticideGroupPage} />
      <Route path="/pesticide/create" component={PesticideCreatePage} />
      <Route path="/pesticide/:id/edit" component={PesticideCreatePage} />
      <Route path="/pesticide/:id" component={PesticideDetailPage} />
      <Route path="/fertilizer" component={FertilizerPage} />
      <Route path="/fertilizer-group" component={FertilizerGroupPage} />
      <Route path="/fertilizer/create" component={FertilizerCreatePage} />
      <Route path="/fertilizer/:id/edit" component={FertilizerCreatePage} />
      <Route path="/fertilizer/:id" component={FertilizerDetailPage} />
      <Route path="/material" component={MaterialPage} />
      <Route path="/material-group" component={MaterialGroupPage} />
      <Route path="/material/create" component={MaterialCreatePage} />
      <Route path="/material/:id" component={MaterialDetailPage} />

      <Route path="/equipment" component={EquipmentPage} />
      <Route path="/vehicle-group" component={EquipmentGroupPage} />
      <Route path="/equipment/create" component={EquipmentCreatePage} />
      <Route path="/equipment/:id/edit" component={EquipmentCreatePage} />
      <Route path="/equipment/:id" component={EquipmentDetailPage} />
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
      <Route path="/unit" component={UnitPage} />
      <Route path="/unit/create" component={UnitCreatePage} />
      <Route path="/unit/:id/edit" component={UnitCreatePage} />
      <Route path="/plan-type" component={PlanTypePage} />
      <Route path="/plan" component={PlanPage} />
      <Route path="/plan/create" component={PlanCreatePage} />
      <Route path="/plan/:id/workflow" component={PlanWorkflowPage} />
      <Route path="/plan/:id/edit" component={PlanEditPage} />
      <Route path="/plan/:id" component={PlanDetailPage} />
      <Route
        path="/production-cultivation-report"
        component={ProductionCultivationReportPage}
      />
      <Route path="/treatment-report" component={TreatmentReportPage} />
      <Route path="/task" component={TaskPage} />
      <Route path="/task/create" component={TaskCreatePage} />
      <Route path="/task/:id/edit" component={TaskEditPage} />
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

      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <AuthWrapper>
        <Suspense fallback={<AppLoadingState />}>
          <Router />
        </Suspense>
        <RadixToaster />
      </AuthWrapper>
    </TooltipProvider>
  );
}

export default App;
