import PageWrapper from "@/components/PageWrapper";
import { Badge, Button, cn, Input } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Camera,
  ClipboardList,
  Clock,
  Filter,
  History,
  ImageOff,
  Layers,
  Link2,
  RefreshCw,
  Search,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { UpdateHistoryTable } from "./components/UpdateHistoryTable";
import { DiaryAdvancedFilterPanel } from "./diary-lookup/components/DiaryAdvancedFilterPanel";
import type { DiaryAdvancedFilters } from "./diary-lookup/hooks/useDiaryLookupPage";
import {
  MOCK_PLANS,
  MOCK_UPDATE_HISTORY,
  MOCK_WORKFLOWS,
} from "./mock/history.mock";

export interface UpdateHistoryPageProps {
  scope?: "PLANNED" | "AD_HOC";
}

export default function UpdateHistoryPage({
  scope,
}: UpdateHistoryPageProps = {}) {
  const [, setLocation] = useLocation();

  // Search & Advanced Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(true);

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

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.workflowIds.length > 0)
      count += appliedFilters.workflowIds.length;
    if (appliedFilters.planIds.length > 0)
      count += appliedFilters.planIds.length;
    if (appliedFilters.workTypes.length > 0)
      count += appliedFilters.workTypes.length;
    if (appliedFilters.fromDate) count += 1;
    if (appliedFilters.toDate) count += 1;
    return count;
  }, [appliedFilters]);

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

  const workflowOptions = useMemo(
    () =>
      MOCK_WORKFLOWS.map((w) => ({
        id: String(w.id),
        name: w.code ? `${w.code} - ${w.name}` : w.name,
      })),
    [],
  );

  const planOptions = useMemo(
    () =>
      MOCK_PLANS.map((p) => ({
        id: String(p.id),
        name: p.code ? `${p.code} - ${p.name}` : p.name,
        workflowId: String(p.workflowId),
      })),
    [],
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

  // Filtered dataset
  const filteredData = useMemo(() => {
    return MOCK_UPDATE_HISTORY.filter((item) => {
      // 1. Filter by scope (PLANNED / AD_HOC)
      if (scope === "PLANNED" && item.origin !== "PLANNED") return false;
      if (scope === "AD_HOC" && item.origin !== "AD_HOC") return false;

      // 2. Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.taskName.toLowerCase().includes(query);
        const matchesCode = item.taskCode.toLowerCase().includes(query);
        const matchesWorkflow = (item.workflowName || "")
          .toLowerCase()
          .includes(query);
        const matchesPlan = (item.planName || "").toLowerCase().includes(query);
        const matchesUpdater = (item.latestUpdate?.updaterName || "")
          .toLowerCase()
          .includes(query);
        const matchesNote = (item.latestUpdate?.note || "")
          .toLowerCase()
          .includes(query);
        if (
          !matchesName &&
          !matchesCode &&
          !matchesWorkflow &&
          !matchesPlan &&
          !matchesUpdater &&
          !matchesNote
        ) {
          return false;
        }
      }

      // 3. Filter by workflowIds
      if (appliedFilters.workflowIds.length > 0) {
        if (
          !item.workflowId ||
          !appliedFilters.workflowIds.includes(String(item.workflowId))
        ) {
          return false;
        }
      }

      // 4. Filter by planIds
      if (appliedFilters.planIds.length > 0) {
        if (
          !item.planId ||
          !appliedFilters.planIds.includes(String(item.planId))
        ) {
          return false;
        }
      }

      // 5. Filter by workTypes
      if (appliedFilters.workTypes.length > 0) {
        const catName = (item.taskCategoryName || "").toLowerCase();
        const matchesType = appliedFilters.workTypes.some((wt) => {
          if (wt === "cultivation") return catName.includes("canh tác");
          if (wt === "treatment")
            return (
              catName.includes("điều trị") ||
              catName.includes("thuốc") ||
              catName.includes("sâu")
            );
          if (wt === "amendment")
            return catName.includes("cải tạo") || catName.includes("đất");
          if (wt === "harvest") return catName.includes("thu hoạch");
          if (wt === "facility-upgrade")
            return catName.includes("nâng cấp") || catName.includes("csvc");
          return false;
        });
        if (!matchesType) return false;
      }

      // 6. Filter by dates
      if (appliedFilters.fromDate) {
        const logDate = item.latestUpdate?.updatedAt?.split("T")[0] || "";
        if (logDate && logDate < appliedFilters.fromDate) return false;
      }
      if (appliedFilters.toDate) {
        const logDate = item.latestUpdate?.updatedAt?.split("T")[0] || "";
        if (logDate && logDate > appliedFilters.toDate) return false;
      }

      return true;
    });
  }, [scope, searchQuery, appliedFilters]);

  // Statistics summary
  const stats = useMemo(() => {
    const list = MOCK_UPDATE_HISTORY.filter((item) => {
      if (scope === "PLANNED") return item.origin === "PLANNED";
      if (scope === "AD_HOC") return item.origin === "AD_HOC";
      return true;
    });
    const total = list.length;
    const planned = list.filter((i) => i.origin === "PLANNED").length;
    const adhoc = list.filter((i) => i.origin === "AD_HOC").length;
    return { total, planned, adhoc };
  }, [scope]);

  const pageTitle =
    scope === "PLANNED"
      ? "Lịch sử cập nhật (Theo kế hoạch)"
      : scope === "AD_HOC"
        ? "Lịch sử cập nhật (Thường nhật)"
        : "Lịch sử cập nhật nhật ký";

  const pageDescription =
    scope === "PLANNED"
      ? "Danh sách các công việc theo kế hoạch có thao tác cập nhật nhật ký mới nhất"
      : scope === "AD_HOC"
        ? "Danh sách các công việc thường nhật có thao tác cập nhật nhật ký mới nhất"
        : "Danh sách các công việc có thao tác cập nhật nhật ký mới nhất";

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
                  {stats.total}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <ClipboardList className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Camera className="h-3.5 w-3.5 text-green-500" />
                <span className="font-bold text-green-600">10</span>
                <span className="text-slate-400">có bằng chứng</span>
              </div>
              <div className="w-px h-4 bg-slate-100" />
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <ImageOff className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-bold text-slate-600">4</span>
                <span className="text-slate-400">không bằng chứng</span>
              </div>
            </div>
          </div>

          {/* Block 2: Tần suất cập nhật */}
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  Số lần trong tháng
                </p>
                <p className="text-3xl font-extrabold text-slate-800 leading-none">
                  3
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <RefreshCw className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Thông tin cập nhật mới nhất trong tháng
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
                  20
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Nhật ký gần nhất được ghi nhận vào ngày này
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
                placeholder="Tìm kiếm nhật ký theo tên công việc, mã công việc, vụ mùa, kế hoạch, người cập nhật..."
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

          {/* DiaryAdvancedFilterPanel Component - Open by default */}
          <DiaryAdvancedFilterPanel
            isOpen={isAdvancedSearchOpen}
            filters={draftFilters}
            onToggleFilter={toggleFilter}
            onDateChange={setDateFilter}
            onReset={resetFilters}
            onApply={() => {
              applyFilters();
            }}
            resultCount={filteredData.length}
            workflowOptions={workflowOptions}
            planOptions={planOptions}
            workTypeOptions={workTypeOptions}
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
                        {filteredData.length}
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

        {/* Main Table */}
        <UpdateHistoryTable data={filteredData} />
      </div>
    </PageWrapper>
  );
}
