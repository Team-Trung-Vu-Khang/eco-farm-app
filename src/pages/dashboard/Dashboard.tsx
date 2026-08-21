import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FarmingFilterDrawer } from "./components/FarmingFilterDrawer";
import { FarmingHistoryTab } from "./components/FarmingHistoryTab";
import { FilterTrigger } from "./components/FilterTrigger";
import { HRFilterDrawer } from "./components/HRFilterDrawer";
import { HRReportTab } from "./components/HRReportTab";
import { OverviewTab } from "./components/OverviewTab";
import { AdminFarmerDashboard } from "./components/AdminFarmerDashboard";
import {
  type FilterState,
  EMPTY_FILTER,
  type HRFilterState,
  EMPTY_HR_FILTER,
} from "./constants";

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<"INTERNAL" | "ADMIN_FARMER">(
    "INTERNAL",
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [farmingFilterOpen, setFarmingFilterOpen] = useState(false);
  const [hrFilterOpen, setHrFilterOpen] = useState(false);
  const [farmingFilter, setFarmingFilter] = useState<FilterState>(EMPTY_FILTER);
  const [hrFilter, setHrFilter] = useState<HRFilterState>(EMPTY_HR_FILTER);

  const handleRemovePlot = (plotId: string) => {
    setFarmingFilter((prev) => ({
      ...prev,
      selectedPlots: prev.selectedPlots.filter((id) => id !== plotId),
    }));
  };

  const handleClearFarmingFilter = () => {
    setFarmingFilter(EMPTY_FILTER);
  };

  const handleClearHRFilter = () => {
    setHrFilter(EMPTY_HR_FILTER);
  };

  return (
    <PageWrapper
      title="Dashboard Quản trị"
      description={
        currentView === "INTERNAL"
          ? "Tổng quan tình hình canh tác, mùa vụ và nhân sự vùng trồng nội bộ"
          : "Báo cáo tuân thủ canh tác, sử dụng phân bón/thuốc BVTV của các hộ liên kết"
      }
      actions={
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              currentView === "INTERNAL"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
            onClick={() => setCurrentView("INTERNAL")}
          >
            Dashboard
          </button>
          <button
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              currentView === "ADMIN_FARMER"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
            onClick={() => setCurrentView("ADMIN_FARMER")}
          >
            Dashboard Admin
          </button>
        </div>
      }
    >
      {currentView === "INTERNAL" ? (
        <Tabs
          defaultValue="overview"
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="overview">Tổng quan vùng trồng</TabsTrigger>
              <TabsTrigger value="farming-history">
                Lịch sử canh tác & Mùa vụ
              </TabsTrigger>
              <TabsTrigger value="hr-report">Báo cáo nhân sự</TabsTrigger>
            </TabsList>

            <FilterTrigger
              activeTab={activeTab}
              farmingFilter={farmingFilter}
              hrFilter={hrFilter}
              onOpenFarmingFilter={() => setFarmingFilterOpen(true)}
              onOpenHRFilter={() => setHrFilterOpen(true)}
              onRemovePlot={handleRemovePlot}
              onClearFarmingFilter={handleClearFarmingFilter}
              onClearHRFilter={handleClearHRFilter}
            />
          </div>

          <TabsContent value="overview">
            <OverviewTab farmingFilter={farmingFilter} />
          </TabsContent>

          <TabsContent value="farming-history">
            <FarmingHistoryTab farmingFilter={farmingFilter} />
          </TabsContent>

          <TabsContent value="hr-report">
            <HRReportTab hrFilter={hrFilter} />
          </TabsContent>
        </Tabs>
      ) : (
        <AdminFarmerDashboard />
      )}

      <FarmingFilterDrawer
        open={farmingFilterOpen}
        onOpenChange={setFarmingFilterOpen}
        initialFilter={farmingFilter}
        onApply={setFarmingFilter}
      />

      <HRFilterDrawer
        open={hrFilterOpen}
        onOpenChange={setHrFilterOpen}
        initialFilter={hrFilter}
        onApply={setHrFilter}
      />
    </PageWrapper>
  );
}
