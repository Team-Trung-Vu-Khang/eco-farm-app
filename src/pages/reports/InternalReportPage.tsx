import { useState, useEffect, useCallback } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Skeleton,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ReportHeaderActions } from "./components/ReportHeaderActions";
import { SmartFilterDialog } from "./components/SmartFilterDialog";
import { FarmingScaleBlock } from "./components/FarmingScaleBlock";
import { MaterialConsumptionBlock } from "./components/MaterialConsumptionBlock";
import { FarmingHistoryBlock } from "./components/FarmingHistoryBlock";
import { HRStatsBlock } from "./components/HRStatsBlock";
import { type FilterState, EMPTY_FILTER } from "@/pages/dashboard/constants";

export default function InternalReportPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [farmingFilter, setFarmingFilter] = useState<FilterState>(EMPTY_FILTER);

  // Simulated fetch trigger when refreshKey changes (800ms mock delay)
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [refreshKey]);

  // Refresh handler (Callback optimized)
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshKey((k) => k + 1);
    }, 400);
  }, []);

  // Filter apply handler (Callback optimized)
  const handleApplyFarmingFilter = useCallback((newFilter: FilterState) => {
    setFarmingFilter(newFilter);
    setRefreshKey((k) => k + 1);
  }, []);

  // --- Render Skeletons for each Tab ---

  const renderOverviewSkeletons = () => (
    <div className="space-y-8 animate-pulse">
      {/* 3 top stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-slate-100 h-28 flex flex-col justify-between"
          >
            <Skeleton className="h-4 w-1/3 bg-slate-200" />
            <Skeleton className="h-8 w-1/2 bg-slate-200" />
            <Skeleton className="h-3 w-2/3 bg-slate-200/60" />
          </div>
        ))}
      </div>

      {/* Toolbar & Crop Cards list */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <Skeleton className="h-5 w-44 bg-slate-200" />
          <div className="flex gap-3 w-full max-w-xl">
            <Skeleton className="h-10 flex-1 bg-slate-200 rounded-lg" />
            <Skeleton className="h-10 w-56 bg-slate-200 rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border border-slate-100 h-64 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 bg-slate-200 rounded-xl" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28 bg-slate-200" />
                    <Skeleton className="h-3 w-16 bg-slate-200/60" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24 bg-slate-200 rounded-lg" />
              </div>
              <Skeleton className="h-6 w-1/3 bg-slate-200" />
              <div className="space-y-2">
                <Skeleton className="h-2 w-full bg-slate-200" />
                <Skeleton className="h-2 w-5/6 bg-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full bg-slate-200 rounded-lg" />
                <Skeleton className="h-10 w-full bg-slate-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHistorySkeletons = () => (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-slate-100 h-44 flex flex-col justify-between"
          >
            <Skeleton className="h-4 w-1/3 bg-slate-200" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-16 bg-slate-200 rounded-xl" />
              <Skeleton className="h-16 bg-slate-200 rounded-xl" />
              <Skeleton className="h-16 bg-slate-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl border border-slate-100 h-64 flex flex-col justify-between"
          >
            <Skeleton className="h-4 w-1/4 bg-slate-200" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full bg-slate-200" />
              <Skeleton className="h-10 w-full bg-slate-200" />
              <Skeleton className="h-10 w-full bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHRSkeletons = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-xl border border-slate-100 h-[380px] flex flex-col justify-between"
        >
          <Skeleton className="h-4 w-1/3 bg-slate-200" />
          <Skeleton className="h-[280px] w-full bg-slate-200 rounded-lg" />
        </div>
      ))}
    </div>
  );

  return (
    <PageWrapper
      title="Báo cáo Nội bộ"
      description="Tổng quan quy mô trồng trọt, tiến độ công việc và nguồn lực nhân sự vùng trồng"
      actions={
        <ReportHeaderActions
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
      }
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
            <TabsTrigger value="farming-history">Lịch sử & Tiến độ</TabsTrigger>
            <TabsTrigger value="hr-report">Nguồn lực nhân sự</TabsTrigger>
          </TabsList>

          {/* Render Smart Filter cascading dialog in tabs header */}
          <SmartFilterDialog
            initialFilter={farmingFilter}
            onApply={handleApplyFarmingFilter}
          />
        </div>

        {/* Tab 1: Tổng quan vùng trồng */}
        <TabsContent value="overview">
          {isLoading ? (
            renderOverviewSkeletons()
          ) : (
            <div className="space-y-8 animate-in fade-in duration-300">
              <FarmingScaleBlock />
              <div className="border-t border-slate-100 my-6" />
              <MaterialConsumptionBlock />
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Lịch sử & Tiến độ */}
        <TabsContent value="farming-history">
          {isLoading ? renderHistorySkeletons() : <FarmingHistoryBlock />}
        </TabsContent>

        {/* Tab 3: Nguồn lực nhân sự */}
        <TabsContent value="hr-report">
          {isLoading ? renderHRSkeletons() : <HRStatsBlock />}
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
