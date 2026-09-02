import PageWrapper from "@/components/PageWrapper";
import { Badge, Button, cn, Input } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Filter, Layers, Search } from "lucide-react";
import { DiaryAdvancedFilterPanel } from "./diary-lookup/components/DiaryAdvancedFilterPanel";
import { DiaryDetailPanel } from "./diary-lookup/components/DiaryDetailPanel";
import { DiaryListSidebar } from "./diary-lookup/components/DiaryListSidebar";
import { DiaryMapSection } from "./diary-lookup/components/DiaryMapSection";
import { useDiaryLookupPage } from "./diary-lookup/hooks/useDiaryLookupPage";

export default function DiaryLookupPage() {
  const {
    entries,
    searchQuery,
    setSearchQuery,
    isAdvancedSearchOpen,
    setIsAdvancedSearchOpen,
    draftFilters,
    toggleFilter,
    setDateFilter,
    applyFilters,
    resetFilters,
    activeFilterCount,
    workflowOptions,
    planOptions,
    workTypeOptions,
    selectedId,
    setSelectedId,
    selectedEntry,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
  } = useDiaryLookupPage();

  return (
    <PageWrapper
      title="Tra cứu nhật ký công việc"
      description="Tìm kiếm nhật ký theo vụ mùa, kế hoạch, loại công việc và khoảng thời gian"
    >
      <div className="flex flex-col h-[calc(100vh-140px)] gap-4 bg-slate-50">
        {/* TOP HEADER: Search & Advanced Search Toggle */}
        <div className="bg-white border rounded-lg p-4 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary"
                size={18}
              />
              <Input
                placeholder="Tìm kiếm nhật ký theo tên công việc, mã nhật ký..."
                className="pl-10 h-11 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all rounded-md bg-slate-50/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant={isAdvancedSearchOpen ? "default" : "outline"}
                className={cn(
                  "flex-1 md:w-48 justify-center h-11 px-4 rounded-md font-bold border-slate-200 transition-all",
                  activeFilterCount > 0 &&
                    "border-primary/50 bg-primary/5 text-primary",
                )}
                onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
              >
                <Filter size={16} className="mr-2" />
                <span>Bộ lọc nâng cao</span>
                {activeFilterCount > 0 && (
                  <Badge
                    variant="default"
                    className="ml-2 h-5 px-1.5 min-w-[20px] justify-center bg-primary text-white border-none shadow-sm"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          <DiaryAdvancedFilterPanel
            isOpen={isAdvancedSearchOpen}
            filters={draftFilters}
            onToggleFilter={toggleFilter}
            onDateChange={setDateFilter}
            onReset={resetFilters}
            onApply={() => {
              applyFilters();
              setIsAdvancedSearchOpen(false);
            }}
            resultCount={entries.length}
            workflowOptions={workflowOptions}
            planOptions={planOptions}
            workTypeOptions={workTypeOptions}
          />

          {!isAdvancedSearchOpen && (
            <div className="relative overflow-hidden rounded-md border border-green-200 bg-linear-to-r from-green-50 via-white to-green-50 p-3 shadow-xs">
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-white shadow-sm border border-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-green-900 uppercase tracking-wider">
                    Tổng quan kết quả
                  </h3>
                  <p className="text-xs text-green-700/80 font-medium">
                    Có{" "}
                    <span className="text-green-600 font-black px-1.5 py-0.5 bg-white rounded-md border border-green-100 shadow-xs">
                      {entries.length}
                    </span>{" "}
                    nhật ký phù hợp với tiêu chí hiện tại.
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-500/5 rounded-full blur-xl" />
            </div>
          )}
        </div>

        <div className="flex-1 flex gap-0 overflow-hidden border rounded-lg shadow-sm bg-white">
          <DiaryListSidebar
            entries={entries}
            selectedId={selectedId}
            onSelect={setSelectedId}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={setIsSidebarCollapsed}
          />

          <DiaryMapSection
            entries={entries}
            selectedEntry={selectedEntry}
            onSelectEntry={setSelectedId}
          />

          {selectedEntry && (
            <DiaryDetailPanel
              entry={selectedEntry}
              onClose={() => setSelectedId(null)}
            />
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
