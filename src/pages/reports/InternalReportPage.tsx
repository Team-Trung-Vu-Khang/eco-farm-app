import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Settings2 } from "lucide-react";
import { FarmingHistoryTab } from "@/pages/dashboard/components/FarmingHistoryTab";
import { HRReportTab } from "@/pages/dashboard/components/HRReportTab";
import { OverviewTab } from "@/pages/dashboard/components/OverviewTab";
import { HRFilterDrawer } from "@/pages/dashboard/components/HRFilterDrawer";
import { ReportHeaderActions } from "./components/ReportHeaderActions";
import { SmartFilterDialog } from "./components/SmartFilterDialog";
import {
  type FilterState,
  EMPTY_FILTER,
  type HRFilterState,
  EMPTY_HR_FILTER,
  positionOptions,
  departmentOptions,
  taskStatusOptions,
} from "@/pages/dashboard/constants";

export default function InternalReportPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filters state
  const [farmingFilter, setFarmingFilter] = useState<FilterState>(EMPTY_FILTER);
  const [hrFilter, setHrFilter] = useState<HRFilterState>(EMPTY_HR_FILTER);
  const [hrFilterOpen, setHrFilterOpen] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshKey((k) => k + 1);
    }, 400);
  };

  const handleApplyFarmingFilter = (newFilter: FilterState) => {
    setFarmingFilter(newFilter);
  };

  const getHRFilterActiveLabel = () => {
    const activeChips: string[] = [];
    if (hrFilter.location) activeChips.push("Vùng làm việc");
    hrFilter.departments.forEach((id) => {
      const dept = departmentOptions.find((d) => d.id === id);
      if (dept) activeChips.push(dept.name.replace("Phòng ", ""));
    });
    hrFilter.positions.forEach((id) => {
      const pos = positionOptions.find((p) => p.id === id);
      if (pos) activeChips.push(pos.name);
    });
    hrFilter.taskStatus.forEach((id) => {
      const status = taskStatusOptions.find((s) => s.id === id);
      if (status) activeChips.push(status.name);
    });

    if (activeChips.length === 0) return "Tất cả nhân sự";
    return activeChips.join(" • ");
  };

  return (
    <PageWrapper
      title="Báo cáo Nội bộ"
      description="Tổng quan tình hình canh tác, mùa vụ và nhân sự vùng trồng nội bộ"
      actions={<ReportHeaderActions onRefresh={handleRefresh} isRefreshing={isRefreshing} />}
    >
      <Tabs
        defaultValue="overview"
        onValueChange={setActiveTab}
        className="space-y-6"
        key={refreshKey}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan vùng trồng</TabsTrigger>
            <TabsTrigger value="farming-history">Lịch sử canh tác vùng</TabsTrigger>
            <TabsTrigger value="hr-report">Báo cáo nhân sự</TabsTrigger>
          </TabsList>

          {/* Render filter controls based on active tab */}
          {activeTab === "hr-report" ? (
            <button
              onClick={() => setHrFilterOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-350 font-semibold text-xs text-slate-700 transition-all cursor-pointer shadow-xs"
            >
              <Settings2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Lọc nhân sự:</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                {getHRFilterActiveLabel()}
              </span>
            </button>
          ) : (
            <SmartFilterDialog
              initialFilter={farmingFilter}
              onApply={handleApplyFarmingFilter}
            />
          )}
        </div>

        <TabsContent value="overview">
          <OverviewTab mode="full" farmingFilter={farmingFilter} />
        </TabsContent>

        <TabsContent value="farming-history">
          <FarmingHistoryTab mode="full" farmingFilter={farmingFilter} />
        </TabsContent>

        <TabsContent value="hr-report">
          <HRReportTab hrFilter={hrFilter} />
        </TabsContent>
      </Tabs>

      <HRFilterDrawer
        open={hrFilterOpen}
        onOpenChange={setHrFilterOpen}
        initialFilter={hrFilter}
        onApply={setHrFilter}
      />
    </PageWrapper>
  );
}
