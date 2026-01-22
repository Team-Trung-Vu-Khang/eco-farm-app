import { Route, Switch } from "wouter";
import Dashboard from "./pages/dashboard/Dashboard";
import TerrainPage from "./pages/terrain/TerrainPage";

import EnterprisePage from "./pages/enterprise/EnterprisePage";
import EnterpriseCreatePage from "./pages/enterprise/EnterpriseCreatePage";
import EnterpriseDetailPage from "./pages/enterprise/EnterpriseDetailPage";
import EnterpriseEditPage from "./pages/enterprise/EnterpriseEditPage";
import BranchPage from "./pages/branch/BranchPage";
import BranchCreatePage from "./pages/branch/BranchCreatePage";
import BranchEditPage from "./pages/branch/BranchEditPage";
import CropPage from "./pages/crop/CropPage";
import CropCreatePage from "./pages/crop/CropCreatePage";
import PesticidePage from "./pages/pesticide/PesticidePage";
import PlanPage from "./pages/plan/PlanPage";
import PlanCreatePage from "./pages/plan/PlanCreatePage";
import NotFoundPage from "./pages/NotFoundPage";
import { Toaster, TooltipProvider } from "@tankhang1/eco-shared-ui";
import BankPage from "./pages/bank/BankPage";
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

// Cultivation Zone Sub-pages
import CultivationAreaPage from "./pages/cultivation-zone/cultivation-area/CultivationAreaPage";
import CultivationAreaCreatePage from "./pages/cultivation-zone/cultivation-area/CultivationAreaCreatePage";
import DistributionDetailPage from "./pages/cultivation-zone/distribution-detail/DistributionDetailPage";
import PlantDistributionCreatePage from "./pages/cultivation-zone/distribution-detail/PlantDistributionCreatePage";
import SearchCropPage from "./pages/cultivation-zone/search-crop/SearchCropPage";
import SearchZonePage from "./pages/cultivation-zone/search-zone/SearchZonePage";

import SeedPage from "./pages/seed/SeedPage";
import GrowthCyclePage from "./pages/growth-cycle/GrowthCyclePage";
import SeasonPage from "./pages/season/SeasonPage";
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
import MaterialPage from "./pages/material/MaterialPage";
import FertilizerPage from "./pages/fertilizer/FertilizerPage";
import ContractPage from "./pages/contract/ContractPage";
import EquipmentPage from "./pages/equipment/EquipmentPage";
import UnitPage from "./pages/unit/UnitPage";
import TaskPage from "./pages/task/TaskPage";
import SettingsPage from "./pages/settings/SettingsPage";
import RegionDetailPage from "./pages/region-chart/region-distribution/RegionDetailPage";
import CultivationAreaDetailPage from "./pages/cultivation-zone/cultivation-area/CultivationAreaDetailPage";
import CultivationAreaEditPage from "./pages/cultivation-zone/cultivation-area/CultivationAreaEditPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/terrain" component={TerrainPage} />
      <Route path="/land" component={LandPage} />
      <Route path="/farming-method" component={FarmingMethodPage} />
      <Route path="/certificate" component={CertificatePage} />
      <Route path="/enterprise" component={EnterprisePage} />
      <Route path="/enterprise/create" component={EnterpriseCreatePage} />
      <Route path="/enterprise/:id" component={EnterpriseDetailPage} />
      <Route path="/enterprise/:id/edit" component={EnterpriseEditPage} />
      <Route path="/branch" component={BranchPage} />
      <Route path="/branch/create" component={BranchCreatePage} />
      <Route path="/branch/:id/edit" component={BranchEditPage} />
      <Route path="/bank" component={BankPage} />
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

      {/* Cultivation Zone Sub-Routes */}
      <Route path="/cultivation-area" component={CultivationAreaPage} />
      <Route
        path="/cultivation-area/create"
        component={CultivationAreaCreatePage}
      />
      <Route
        path="/cultivation-area/:id"
        component={CultivationAreaDetailPage}
      />
      <Route
        path="/cultivation-area/:id/edit"
        component={CultivationAreaEditPage}
      />
      <Route path="/distribution-detail" component={DistributionDetailPage} />
      <Route
        path="/distribution-detail/create"
        component={PlantDistributionCreatePage}
      />
      <Route
        path="/distribution-detail/:id/edit"
        component={PlantDistributionCreatePage}
      />
      <Route path="/search-crop" component={SearchCropPage} />
      <Route path="/search-zone" component={SearchZonePage} />

      <Route path="/crop" component={CropPage} />
      <Route path="/crop/create" component={CropCreatePage} />
      <Route path="/variety" component={VarietyPage} />
      <Route path="/seed" component={SeedPage} />
      <Route path="/growth-cycle" component={GrowthCyclePage} />
      <Route path="/season" component={SeasonPage} />
      <Route path="/pesticide" component={PesticidePage} />
      <Route path="/fertilizer" component={FertilizerPage} />
      <Route path="/material" component={MaterialPage} />
      <Route path="/equipment" component={EquipmentPage} />
      <Route path="/contract" component={ContractPage} />
      <Route path="/unit" component={UnitPage} />
      <Route path="/plan" component={PlanPage} />
      <Route path="/plan/create" component={PlanCreatePage} />
      <Route path="/task" component={TaskPage} />
      <Route path="/settings" component={SettingsPage} />
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
