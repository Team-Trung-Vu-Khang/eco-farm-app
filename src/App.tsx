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
import CultivationZonePage from "./pages/cultivation-zone/CultivationZonePage";
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
      <Route path="/geo-zone" component={GeoZonePage} />
      <Route path="/cultivation-zone" component={CultivationZonePage} />
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
