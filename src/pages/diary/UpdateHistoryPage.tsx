import PageWrapper from "@/components/PageWrapper";
import {
  useFarmDailyDiaryEntries,
  useFarmDailyDiaryStats,
  type FarmPlanPurpose,
} from "@/features/farm-daily-diary";
import {
  useFarmPlanTaskDiaryEntries,
  useFarmPlanTaskDiaryStats,
} from "@/features/farm-plan-task-diary";
import { useFarmPlans, useFarmWorkflows } from "@/features/farm-workflow/hooks";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { Badge, Button, cn, Input } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Camera,
  ClipboardList,
  Clock,
  Filter,
  ImageOff,
  Layers,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { DiaryAdvancedFilterPanel } from "./components/lookup/DiaryAdvancedFilterPanel";
import { UpdateHistoryTable } from "./components/table/UpdateHistoryTable";
import type { DiaryAdvancedFilters } from "./hooks/useDiaryLookupPage";

const WORK_TYPE_TO_PURPOSE_MAP: Record<string, FarmPlanPurpose> = {
  cultivation: "CULTIVATION",
  "facility-upgrade": "FACILITY_UPGRADE",
  treatment: "TREATMENT",
  amendment: "SOIL_IMPROVEMENT",
  harvest: "HARVEST",
};

export interface UpdateHistoryPageProps {
  scope?: "PLANNED" | "AD_HOC";
}

export default function UpdateHistoryPage({
  scope = "PLANNED",
}: UpdateHistoryPageProps = {}) {
  const [, setLocation] = useLocation();

  // Pagination States for Daily Diary
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  // Search & Advanced Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(true);

  // Reset page to 0 when search query changes
  useEffect(() => {
    setPage(0);
  }, [debouncedSearchQuery]);

  const [draftFilters, setDraftFilters] = useState<DiaryAdvancedFilters>({
    workflowIds: [],
    planIds: [],
    workTypes: [],
    fromDate: "",
    toDate: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<DiaryAdvancedFilters>({
    workflowIds: [],
    planIds: [],
    workTypes: [],
    fromDate: "",
    toDate: "",
  });

  const selectedWorkflowId =
    appliedFilters.workflowIds.length > 0
      ? Number(appliedFilters.workflowIds[0])
      : undefined;
  const selectedPlanId =
    appliedFilters.planIds.length > 0
      ? Number(appliedFilters.planIds[0])
      : undefined;

  const activePurposes = useMemo(() => {
    const list = appliedFilters.workTypes
      .map((wt) => WORK_TYPE_TO_PURPOSE_MAP[wt])
      .filter(Boolean) as FarmPlanPurpose[];
    return list.length > 0 ? (list.length === 1 ? list[0] : list) : undefined;
  }, [appliedFilters.workTypes]);

  // Fetch real Daily Diary Entries when scope === 'AD_HOC'
  const isAdHoc = scope === "AD_HOC";
  const isPlanned = !isAdHoc;

  const dailyQueryParams = useMemo(
    () => ({
      page,
      size,
      workflowId: selectedWorkflowId,
      purpose: activePurposes,
      keyword: debouncedSearchQuery.trim() || undefined,
      fromDate: appliedFilters.fromDate || undefined,
      toDate: appliedFilters.toDate || undefined,
    }),
    [
      page,
      size,
      selectedWorkflowId,
      activePurposes,
      debouncedSearchQuery,
      appliedFilters.fromDate,
      appliedFilters.toDate,
    ],
  );

  const {
    data: dailyDiaryPageData,
    isLoading: isDailyLoading,
    refetch: refetchDailyEntries,
  } = useFarmDailyDiaryEntries({
    params: dailyQueryParams,
    enabled: isAdHoc,
  });

  const { data: dailyStatsData } = useFarmDailyDiaryStats({
    params: dailyQueryParams,
    enabled: isAdHoc,
  });

  // Fetch real Plan Task Diary Entries when isPlanned (scope === 'PLANNED')
  const plannedQueryParams = useMemo(
    () => ({
      page,
      size,
      keyword: debouncedSearchQuery.trim() || undefined,
      workflowId: selectedWorkflowId,
      planId: selectedPlanId,
      purpose: activePurposes,
      fromDate: appliedFilters.fromDate || undefined,
      toDate: appliedFilters.toDate || undefined,
    }),
    [
      page,
      size,
      debouncedSearchQuery,
      selectedWorkflowId,
      selectedPlanId,
      activePurposes,
      appliedFilters.fromDate,
      appliedFilters.toDate,
    ],
  );

  const { pageData: plannedDiaryPageData, loading: isPlannedLoading } =
    useFarmPlanTaskDiaryEntries({
      params: plannedQueryParams,
      enabled: isPlanned,
    });

  const { data: plannedStatsData } = useFarmPlanTaskDiaryStats({
    params: plannedQueryParams,
    enabled: isPlanned,
  });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.workflowIds.length > 0)
      count += appliedFilters.workflowIds.length;
    if (!isAdHoc && appliedFilters.planIds.length > 0)
      count += appliedFilters.planIds.length;
    if (appliedFilters.workTypes.length > 0)
      count += appliedFilters.workTypes.length;
    if (appliedFilters.fromDate) count += 1;
    if (appliedFilters.toDate) count += 1;
    return count;
  }, [appliedFilters, isAdHoc]);

  const toggleFilter = (
    key: "workflowIds" | "planIds" | "workTypes",
    value: string,
  ) => {
    setDraftFilters((prev) => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const setDateFilter = (key: "fromDate" | "toDate", value: string) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
  };

  const resetFilters = () => {
    const empty: DiaryAdvancedFilters = {
      workflowIds: [],
      planIds: [],
      workTypes: [],
      fromDate: "",
      toDate: "",
    };
    setDraftFilters(empty);
    setAppliedFilters(empty);
  };

  const workflowsQuery = useFarmWorkflows({ params: { page: 0, size: 100 } });
  const apiWorkflows = workflowsQuery.items || [];

  const plansQuery = useFarmPlans({ params: { page: 0, size: 100 } });
  const apiPlans = plansQuery.items || [];

  const workflowOptions = useMemo(
    () =>
      apiWorkflows.map((w) => ({
        id: String(w.id),
        name: w.code ? `${w.code} - ${w.name}` : w.name,
      })),
    [apiWorkflows],
  );

  const planOptions = useMemo(
    () =>
      apiPlans.map((p) => ({
        id: String(p.id),
        name: p.code ? `${p.code} - ${p.name}` : p.name,
        workflowId: p.workflowId ? String(p.workflowId) : "",
      })),
    [apiPlans],
  );

  const workTypeOptions = useMemo(
    () => [
      { id: "cultivation", name: "Canh tác" },
      { id: "facility-upgrade", name: "Nâng cấp CSVC" },
      { id: "treatment", name: "Điều trị" },
      { id: "amendment", name: "Cải tạo đất" },
      { id: "harvest", name: "Thu hoạch" },
    ],
    [],
  );

  // Statistics summary from real API
  const activeStatsData = isAdHoc ? dailyStatsData : plannedStatsData;

  const totalUpdates =
    activeStatsData?.totalUpdates ??
    (isAdHoc
      ? (dailyDiaryPageData?.totalElements ?? 0)
      : (plannedDiaryPageData?.totalElements ?? 0));
  const withEvidence = activeStatsData?.withEvidence ?? 0;
  const withoutEvidence =
    activeStatsData?.withoutEvidence ??
    Math.max(0, totalUpdates - withEvidence);

  const formattedLatestUpdate = useMemo(() => {
    const raw = activeStatsData?.latestUpdatedAt;
    if (!raw) return "Chưa có cập nhật";
    const date = new Date(raw);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });
  }, [activeStatsData?.latestUpdatedAt]);

  const pageTitle = isAdHoc
    ? "Lịch sử cập nhật (Thường nhật)"
    : "Lịch sử cập nhật (Theo kế hoạch)";

  const pageDescription = isAdHoc
    ? "Danh sách các công việc thường nhật có thao tác cập nhật nhật ký mới nhất"
    : "Danh sách các công việc theo kế hoạch có thao tác cập nhật nhật ký mới nhất";

  const currentResultCount = isAdHoc
    ? (dailyDiaryPageData?.totalElements ?? 0)
    : (plannedDiaryPageData?.totalElements ?? 0);

  return (
    <PageWrapper title={pageTitle} description={pageDescription}>
      <div className="space-y-6 pb-12">
        {/* Stat Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Block 1: Tổng số lần cập nhật */}
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  Tổng lần cập nhật
                </p>
                <p className="text-3xl font-extrabold text-slate-800 leading-none">
                  {totalUpdates}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <ClipboardList className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Camera className="h-3.5 w-3.5 text-green-500" />
                <span className="font-bold text-green-600">{withEvidence}</span>
                <span className="text-slate-400">có bằng chứng</span>
              </div>
              <div className="w-px h-4 bg-slate-100" />
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <ImageOff className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-bold text-slate-600">
                  {withoutEvidence}
                </span>
                <span className="text-slate-400">không bằng chứng</span>
              </div>
            </div>
          </div>

          {/* Block 2: Tỷ lệ bằng chứng */}
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  Số nhật ký có ảnh
                </p>
                <p className="text-3xl font-extrabold text-slate-800 leading-none">
                  {withEvidence}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Camera className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Chiếm{" "}
              {totalUpdates > 0
                ? Math.round((withEvidence / totalUpdates) * 100)
                : 0}
              % tổng số lượt ghi nhật ký
            </p>
          </div>

          {/* Block 3: Cập nhật mới nhất */}
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  Cập nhật mới nhất
                </p>
                <p className="text-2xl font-extrabold text-slate-800 leading-none">
                  {formattedLatestUpdate}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Thời gian ghi nhận mới nhất (UTC)
            </p>
          </div>
        </div>

        {/* ── SEARCH & ADVANCED FILTER HEADER ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full group">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-green-600"
                size={18}
              />
              <Input
                placeholder="Tìm kiếm nhật ký theo mã, tên công việc, ghi chú..."
                className="pl-10 h-11 border-slate-200 focus:border-green-600 focus:ring-green-600/20 transition-all rounded-xl bg-slate-50/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto shrink-0">
              <Button
                variant={isAdvancedSearchOpen ? "default" : "outline"}
                className={cn(
                  "flex-1 md:w-48 justify-center h-11 px-4 rounded-xl font-bold border-slate-200 transition-all cursor-pointer",
                  isAdvancedSearchOpen
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/20"
                    : activeFilterCount > 0
                      ? "border-green-400 bg-green-50 text-green-700"
                      : "bg-white hover:bg-slate-50 text-slate-700",
                )}
                onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
              >
                <Filter size={16} className="mr-2" />
                <span>Bộ lọc nâng cao</span>
                {activeFilterCount > 0 && (
                  <Badge
                    variant="default"
                    className="ml-2 h-5 px-1.5 min-w-[20px] justify-center bg-green-700 text-white border-none shadow-xs font-bold text-[10px]"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* DiaryAdvancedFilterPanel Component */}
          <DiaryAdvancedFilterPanel
            isOpen={isAdvancedSearchOpen}
            filters={draftFilters}
            onToggleFilter={toggleFilter}
            onDateChange={setDateFilter}
            onReset={resetFilters}
            onApply={() => {
              applyFilters();
            }}
            resultCount={currentResultCount}
            workflowOptions={workflowOptions}
            planOptions={planOptions}
            workTypeOptions={workTypeOptions}
            hidePlanFilter={isAdHoc}
          />

          {!isAdvancedSearchOpen && (
            <div className="relative overflow-hidden rounded-xl border border-green-200 bg-gradient-to-r from-green-50 via-white to-green-50 p-3 shadow-2xs">
              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white shadow-xs border border-green-100 flex items-center justify-center text-green-600 shrink-0">
                    <Layers className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-green-900 uppercase tracking-wider">
                      Tổng quan kết quả lọc
                    </h3>
                    <p className="text-xs text-green-700/80 font-medium mt-0.5">
                      Có{" "}
                      <span className="text-green-700 font-extrabold px-1.5 py-0.5 bg-white rounded-md border border-green-200 shadow-2xs">
                        {currentResultCount}
                      </span>{" "}
                      nhật ký phù hợp với tiêu chí hiện tại.
                    </p>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-xs font-bold text-slate-500 hover:text-red-600 underline"
                  >
                    Xóa tất cả bộ lọc ({activeFilterCount})
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <UpdateHistoryTable
          isDaily={isAdHoc}
          dailyEntries={dailyDiaryPageData?.content || []}
          plannedEntries={plannedDiaryPageData?.content || []}
          pageSize={size}
          currentIndex={page + 1}
          totalElements={
            isAdHoc
              ? (dailyDiaryPageData?.totalElements ?? 0)
              : (plannedDiaryPageData?.totalElements ?? 0)
          }
          totalPages={
            isAdHoc
              ? (dailyDiaryPageData?.totalPages ?? 0)
              : (plannedDiaryPageData?.totalPages ?? 0)
          }
          onPageSize={(newSize) => {
            setSize(newSize);
            setPage(0);
          }}
          onIndexChange={(newIndex) => setPage(newIndex - 1)}
          loading={isAdHoc ? isDailyLoading : isPlannedLoading}
        />
      </div>
    </PageWrapper>
  );
}
