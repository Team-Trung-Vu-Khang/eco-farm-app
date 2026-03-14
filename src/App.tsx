import { Route, Switch } from "wouter";
import Dashboard from "./pages/dashboard/Dashboard";
import TerrainPage from "./pages/terrain/TerrainPage";

import EnterprisePage from "./pages/enterprise/EnterprisePage";
import EnterpriseCreatePage from "./pages/enterprise/EnterpriseCreatePage";
import EnterpriseDetailPage from "./pages/enterprise/EnterpriseDetailPage";
import EnterpriseEditPage from "./pages/enterprise/EnterpriseEditPage";
import BranchPage from "./pages/branch/BranchPage";
import BranchFormPage from "./pages/branch/BranchFormPage";
import BranchDetailPage from "./pages/branch/BranchDetailPage";
import CropPage from "./pages/crop/CropPage";
import CropCreatePage from "./pages/crop/CropCreatePage";
import CropDetailPage from "./pages/crop/CropDetailPage";

import PesticidePage from "./pages/pesticide/PesticidePage";
import PesticideCreatePage from "./pages/pesticide/PesticideCreatePage";
import PesticideDetailPage from "./pages/pesticide/PesticideDetailPage";
import PlanPage from "./pages/plan/PlanPage";
import PlanCreatePage from "./pages/plan/PlanCreatePage";
import PlanDetailPage from "./pages/plan/PlanDetailPage";
import PlanEditPage from "./pages/plan/PlanEditPage";
import PlanTypePage from "./pages/plan-type/PlanTypePage";
import FertilizerCreatePage from "./pages/fertilizer/FertilizerCreatePage";
import MaterialCreatePage from "./pages/material/MaterialCreatePage";
import MaterialDetailPage from "./pages/material/MaterialDetailPage";
import EquipmentCreatePage from "./pages/equipment/EquipmentCreatePage";
import EquipmentDetailPage from "./pages/equipment/EquipmentDetailPage";
import UnitCreatePage from "./pages/unit/UnitCreatePage";

import NotFoundPage from "./pages/NotFoundPage";
import { Toaster, TooltipProvider } from "@tankhang1/eco-shared-ui";
import BankPage from "./pages/bank/BankPage";
import BankDirectoryPage from "./pages/bank/BankDirectoryPage";
import BankCreatePage from "./pages/bank/BankCreatePage";
import BankEditPage from "./pages/bank/BankEditPage";
import GeoZonePage from "./pages/geo-zone/GeoZonePage";

// Region Chart Pages
import RegionDistributionPage from "./pages/region-chart/region-distribution/RegionDistributionPage";
import RegionCreatePage from "./pages/region-chart/region-distribution/RegionCreatePage";
import AreaDistributionPage from "./pages/region-chart/area-distribution/AreaDistributionPage";
import AreaCreatePage from "./pages/region-chart/area-distribution/AreaCreatePage";
import AreaDetailPage from "./pages/region-chart/area-distribution/AreaDetailPage";
import PlotDistributionPage from "./pages/region-chart/plot-distribution/PlotDistributionPage";
import PlotCreatePage from "./pages/region-chart/plot-distribution/PlotCreatePage";
import PlotDetailPage from "./pages/region-chart/plot-distribution/PlotDetailPage";
import MapViewPage from "./pages/region-chart/map-view/MapViewPage";
import SoilAmendmentMapPage from "./pages/region-chart/soil-map/SoilAmendmentMapPage";
import AmendmentCyclePage from "./pages/soil-amendment/AmendmentCyclePage";
import AmendmentMethodPage from "./pages/soil-amendment/AmendmentMethodPage";
import AmendmentPlanPage from "./pages/soil-amendment/AmendmentPlanPage";
import AmendmentPlanCreatePage from "./pages/soil-amendment/AmendmentPlanCreatePage";
import AmendmentTaskPage from "./pages/soil-amendment/AmendmentTaskPage";
import SoilAmendmentTreatmentPage from "./pages/soil-amendment/SoilAmendmentTreatmentPage";

// Cultivation Zone Sub-pages
import CultivationRegionPage from "./pages/cultivation-zone/cultivation-region/CultivationRegionPage";
import CultivationRegionCreatePage from "./pages/cultivation-zone/cultivation-region/CultivationRegionCreatePage";
import DistributionDetailPage from "./pages/cultivation-zone/distribution-detail/DistributionDetailPage";
import PlantDistributionCreatePage from "./pages/cultivation-zone/distribution-detail/PlantDistributionCreatePage";
import SearchCropPage from "./pages/cultivation-zone/search-crop/SearchCropPage";
import SearchZonePage from "./pages/cultivation-zone/search-zone/SearchZonePage";

import SeedPage from "./pages/seed/SeedPage";
import GrowthCyclePage from "./pages/growth-cycle/GrowthCyclePage";
import CreateGrowthCyclePage from "./pages/growth-cycle/CreateGrowthCyclePage";
import UpdateGrowthCyclePage from "./pages/growth-cycle/UpdateGrowthCyclePage";
import SeasonPage from "./pages/season/SeasonPage";
import CreateSeasonPage from "./pages/season/CreateSeasonPage";
import UpdateSeasonPage from "./pages/season/UpdateSeasonPage";
import SeasonDetailPage from "./pages/season/SeasonDetailPage";
import LandPage from "./pages/land/LandPage";
import FarmingMethodPage from "./pages/farming-method/FarmingMethodPage";
import CertificatePage from "./pages/certificate/CertificatePage";
import ContactPage from "./pages/contact/ContactPage";
import ContactCreatePage from "./pages/contact/ContactCreatePage";
import ContactEditPage from "./pages/contact/ContactEditPage";
import DepartmentPage from "./pages/department/DepartmentPage";
import PositionPage from "./pages/position/PositionPage";
import PersonnelPage from "./pages/personnel/PersonnelPage";
import PersonnelCreatePage from "./pages/personnel/PersonnelCreatePage";
import PersonnelEditPage from "./pages/personnel/PersonnelEditPage";
import TeamPage from "./pages/team/TeamPage";
import TeamCreatePage from "./pages/team/TeamCreatePage";
import TeamDetailPage from "./pages/team/TeamDetailPage";
import VarietyPage from "./pages/variety/VarietyPage";
import VarietyDetailPage from "./pages/variety/VarietyDetailPage";
import CreateVarietyPage from "./pages/variety/CreateVarietyPage";
import VarietyEditPage from "./pages/variety/VarietyEditPage";
import MaterialPage from "./pages/material/MaterialPage";
import FertilizerPage from "./pages/fertilizer/FertilizerPage";
import ContractPage from "./pages/contract/ContractPage";
import EquipmentPage from "./pages/equipment/EquipmentPage";
import UnitPage from "./pages/unit/UnitPage";
import TaskPage from "./pages/task/TaskPage";
import TaskCreatePage from "./pages/task/TaskCreatePage";
import TaskEditPage from "./pages/task/TaskEditPage";
import SettingsPage from "./pages/settings/SettingsPage";
import RegionDetailPage from "./pages/region-chart/region-distribution/RegionDetailPage";
import CultivationRegionDetailPage from "./pages/cultivation-zone/cultivation-region/CultivationRegionDetailPage";
import CultivationRegionEditPage from "./pages/cultivation-zone/cultivation-region/CultivationRegionEditPage";
import ContractDetailPage from "./pages/contract/ContractDetailPage";
import ContractCreatePage from "./pages/contract/ContractCreatePage";
import ContractEditPage from "./pages/contract/ContractEditPage";
import TreatmentPage from "./pages/treatment/TreatmentPage";
import GroupCropPage from "./pages/group-crop/GroupCropPage";
import DocsPage from "./pages/docs/DocsPage";
import CreateDocsPage from "./pages/docs/CreateDocsPage";
import UpdateDocsPage from "./pages/docs/UpdateDocsPage";
import DocsDetailPage from "./pages/docs/DocsDetailPage";
import CreateSeedPage from "./pages/seed/CreateSeedPage";
import SeedDetailPage from "./pages/seed/SeedDetailPage";
import UpdateSeedPage from "./pages/seed/UpdateSeedPage";
import CreateTreatmentPage from "./pages/treatment/CreateTreatmentPage";
import PlantDistributionListPage from "./pages/cultivation-zone/distribution-detail/PlantDistributionListPage";
import FarmerPage from "./pages/farmer/FarmerPage";
import FarmerCreatePage from "./pages/farmer/FarmerCreatePage";
import FarmerEditPage from "./pages/farmer/FarnerEditPage";
import FarmerDetailPage from "./pages/farmer/FarmerDetailPage";
import CooperativePage from "./pages/cooperative/CooperativePage";
import CooperativeCreatePage from "./pages/cooperative/CooperativeCreatePage";
import CooperativeEditPage from "./pages/cooperative/CooperativeEditPage";
import CooperativeDetailPage from "./pages/cooperative/CooperativeDetailPage";
import EnterpriseTypePage from "./pages/enterprise-type/EnterpriseTypePage";
import EnterpriseFormPage from "./pages/enterprise-form/EnterpriseFormPage";
import EnterpriseCertificatePage from "./pages/enterprise-certificate/EnterpriseCertificatePage";
import MaterialGroupPage from "./pages/material-group/MaterialGroupPage";
import FertilizerGroupPage from "./pages/fertilizer-group/FertilizerGroupPage";
import PesticideGroupPage from "./pages/pesticide-group/PesticideGroupPage";
import EquipmentGroupPage from "./pages/equipment-group/EquipmentGroupPage";
import PlantIdentificationListPage from "./pages/cultivation-zone/cultivation-region/PlantIdentificationListPage";
import PlantIdentificationDetailPage from "./pages/cultivation-zone/cultivation-region/PlantIdentificationDetailPage";
import PlantIdentificationCreatePage from "./pages/cultivation-zone/cultivation-region/PlantIdentificationCreatePage";
import PlantIdentificationEditPage from "./pages/cultivation-zone/cultivation-region/PlantIdentificationEditPage";
import CultivationAreaPage from "./pages/cultivation-area/CultivationAreaPage";
import CultivationAreaCreatePage from "./pages/cultivation-area/CultivationAreaCreatePage";
import CultivationAreaDetailPage from "./pages/cultivation-area/CultivationAreaDetailPage";
import CultivationPlotPage from "./pages/cultivation-plot/CultivationPlotPage";
import CultivationPlotCreatePage from "./pages/cultivation-plot/CultivationPlotCreatePage";
import CultivationPlotDetailPage from "./pages/cultivation-plot/CultivationPlotDetailPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/terrain" component={TerrainPage} />
      <Route path="/land" component={LandPage} />
      <Route path="/farming-method" component={FarmingMethodPage} />
      <Route path="/certificate" component={CertificatePage} />
      <Route path="/enterprise-type" component={EnterpriseTypePage} />
      <Route path="/enterprise-form" component={EnterpriseFormPage} />
      <Route
        path="/enterprise-certificate"
        component={EnterpriseCertificatePage}
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
      <Route path="/position" component={PositionPage} />
      <Route path="/personnel" component={PersonnelPage} />
      <Route path="/personnel/create" component={PersonnelCreatePage} />
      <Route path="/personnel/:id/edit" component={PersonnelEditPage} />
      <Route path="/team" component={TeamPage} />
      <Route path="/team/create" component={TeamCreatePage} />
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
      <Route path="/map-view" component={MapViewPage} />
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
        component={CultivationRegionEditPage}
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
      <Route path="/cultivation-plot/create" component={CultivationPlotCreatePage} />
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
      <Route path="/group-crop" component={GroupCropPage} />
      <Route path="/docs" component={DocsPage} />
      <Route path="/docs/create" component={CreateDocsPage} />
      <Route path="/docs/update/:id" component={UpdateDocsPage} />
      <Route path="/docs/:id" component={DocsDetailPage} />
      <Route path="/variety" component={VarietyPage} />
      <Route path="/variety/create" component={CreateVarietyPage} />
      <Route path="/variety/:id" component={VarietyDetailPage} />
      <Route path="/variety/:id/edit" component={VarietyEditPage} />
      <Route path="/seed" component={SeedPage} />
      <Route path="/seed/create" component={CreateSeedPage} />
      <Route path="/seed/:id/edit" component={UpdateSeedPage} />
      <Route path="/seed/:id" component={SeedDetailPage} />
      <Route path="/growth-cycle" component={GrowthCyclePage} />
      <Route path="/growth-cycle/create" component={CreateGrowthCyclePage} />
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
      <Route path="/contract/create" component={ContractCreatePage} />
      <Route path="/contract/:id/edit" component={ContractEditPage} />
      <Route path="/contract/:id" component={ContractDetailPage} />
      <Route path="/unit" component={UnitPage} />
      <Route path="/unit/create" component={UnitCreatePage} />
      <Route path="/unit/:id/edit" component={UnitCreatePage} />
      <Route path="/plan-type" component={PlanTypePage} />
      <Route path="/plan" component={PlanPage} />
      <Route path="/plan/create" component={PlanCreatePage} />
      <Route path="/plan/:id/edit" component={PlanEditPage} />
      <Route path="/plan/:id" component={PlanDetailPage} />
      <Route path="/task" component={TaskPage} />
      <Route path="/task/create" component={TaskCreatePage} />
      <Route path="/task/:id/edit" component={TaskEditPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/treatment" component={TreatmentPage} />
      <Route path="/treatment/create" component={CreateTreatmentPage} />

      <Route path="/farmer" component={FarmerPage} />
      <Route path="/farmer/create" component={FarmerCreatePage} />
      <Route path="/farmer/:id/edit" component={FarmerEditPage} />
      <Route path="/farmer/:id" component={FarmerDetailPage} />

      <Route path="/cooperative" component={CooperativePage} />
      <Route path="/cooperative/create" component={CooperativeCreatePage} />
      <Route path="/cooperative/:id/edit" component={CooperativeEditPage} />
      <Route path="/cooperative/:id" component={CooperativeDetailPage} />

      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
// export const mount = (el: HTMLElement, props: any) => {
//   const root = createRoot(el);
//   root.render(<App basename={props.basename} />);
//   return () => root.unmount();
// };
