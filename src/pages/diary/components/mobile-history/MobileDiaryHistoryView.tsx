import {
  useInfiniteFarmDailyDiaryEntries,
  type FarmDailyDiaryEntryResponse,
  type FarmPlanPurpose,
} from "@/features/farm-daily-diary";
import { useDebounce } from "@/shared/hooks/useDebounce";
import dayjs from "dayjs";
import { Loader2, NotebookPen, RotateCcw, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { MobileDiaryCard } from "./MobileDiaryCard";
import { MobilePurposePills } from "./MobilePurposePills";
import { MobileZoneFilterSheets } from "./MobileZoneFilterSheets";

export function MobileDiaryHistoryView() {
  // State tìm kiếm
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);

  // State bộ lọc Vườn & Lô
  const [selectedRegionId, setSelectedRegionId] = useState<number | undefined>(
    undefined,
  );
  const [selectedPlotId, setSelectedPlotId] = useState<number | undefined>(
    undefined,
  );

  // State bộ lọc Loại việc (Purpose Pill)
  const [selectedPurpose, setSelectedPurpose] = useState<
    FarmPlanPurpose | undefined
  >(undefined);

  // Gọi API Infinite Query
  const {
    data,
    isLoading,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteFarmDailyDiaryEntries({
    params: {
      purpose: selectedPurpose,
      keyword: debouncedSearch.trim() || undefined,
      zoneId: selectedPlotId || selectedRegionId,
    },
    pageSize: 10,
  });

  // Trạng thái đang tìm kiếm (khi người dùng đang gõ debounce hoặc query đang tải kết quả tìm kiếm)
  const isSearchDebouncing =
    Boolean(searchQuery.trim()) && searchQuery !== debouncedSearch;
  const isSearchFetching =
    Boolean(debouncedSearch.trim()) && isFetching && !isFetchingNextPage;
  const isSearching = isSearchDebouncing || isSearchFetching;

  // Trạng thái đang lọc dữ liệu (initial load, hoặc đang fetch bộ lọc mới / tìm kiếm mới)
  const isFiltering =
    isLoading || (isFetching && !isFetchingNextPage) || isSearchDebouncing;

  // Đếm số lượng bộ lọc đang được áp dụng
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedRegionId) count++;
    if (selectedPlotId) count++;
    if (selectedPurpose) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedRegionId, selectedPlotId, selectedPurpose, searchQuery]);

  const hasActiveFilter = activeFilterCount > 0;

  // Hàm xóa sạch toàn bộ filter
  const handleResetAllFilters = () => {
    setSelectedRegionId(undefined);
    setSelectedPlotId(undefined);
    setSelectedPurpose(undefined);
    setSearchQuery("");
  };

  // Gộp tất cả các trang thành danh sách nhật ký phẳng
  const allEntries = useMemo(() => {
    if (!data?.pages) return [];
    const entries: FarmDailyDiaryEntryResponse[] = [];
    data.pages.forEach((page) => {
      if (page.content) {
        entries.push(...page.content);
      }
    });
    return entries;
  }, [data]);

  // Gom nhóm danh sách nhật ký theo Tháng (vd: "Tháng 10/2026")
  const groupedByMonth = useMemo(() => {
    const groups: {
      monthKey: string;
      entries: FarmDailyDiaryEntryResponse[];
    }[] = [];
    const map = new Map<string, FarmDailyDiaryEntryResponse[]>();

    allEntries.forEach((entry) => {
      const dateStr = entry.lines?.[0]?.startDate || entry.createdAt;
      const monthKey = `Tháng ${dayjs(dateStr).format("MM/YYYY")}`;

      if (!map.has(monthKey)) {
        map.set(monthKey, []);
        groups.push({ monthKey, entries: map.get(monthKey)! });
      }
      map.get(monthKey)!.push(entry);
    });

    return groups;
  }, [allEntries]);

  // Infinite Scroll Sentinel dùng IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "250px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="space-y-3.5 pb-8 animate-fade-in">
      {/* 1. Header: Tiêu đề + Nút Search */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Lịch sử nhật ký
        </h1>

        <button
          type="button"
          aria-label={showSearch ? "Đóng tìm kiếm" : "Mở tìm kiếm"}
          onClick={() => {
            setShowSearch((prev) => !prev);
            if (showSearch) setSearchQuery("");
          }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200/80 active:scale-95 transition-all shadow-2xs"
        >
          {showSearch ? (
            <X className="h-5 w-5 text-slate-600" />
          ) : (
            <Search className="h-5 w-5 stroke-[2.2]" />
          )}
        </button>
      </div>

      {/* Ô tìm kiếm mở rộng (nếu showSearch = true) */}
      {showSearch && (
        <div className="relative animate-fade-in">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên công việc, vật tư, ghi chú..."
            autoFocus
            className="w-full h-11 pl-10 pr-10 rounded-2xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
          />
          {isSearching ? (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
            </div>
          ) : searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      )}

      {/* 2. Hàng Dropdown: Tất cả vườn & Tất cả lô */}
      <MobileZoneFilterSheets
        selectedRegionId={selectedRegionId}
        onSelectRegion={setSelectedRegionId}
        selectedPlotId={selectedPlotId}
        onSelectPlot={setSelectedPlotId}
      />

      {/* 3. Hàng Pills phân loại công việc cuộn ngang */}
      <MobilePurposePills
        selectedPurpose={selectedPurpose}
        onSelectPurpose={setSelectedPurpose}
      />

      {/* 3.1. Nút hủy bộ lọc nhỏ gọn khi đang có bất kỳ filter nào được áp dụng */}
      {hasActiveFilter && (
        <div className="flex items-center justify-between px-1 -mt-1 animate-fade-in text-xs">
          <span className="text-slate-400 text-[11px] font-medium">
            Đang lọc ({activeFilterCount})
          </span>
          <button
            type="button"
            onClick={handleResetAllFilters}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 active:scale-95 transition-all bg-rose-50/90 hover:bg-rose-100/80 border border-rose-200/70 px-2 py-0.5 rounded-full shadow-2xs"
          >
            <RotateCcw className="h-2.5 w-2.5" />
            <span>Xóa bộ lọc</span>
          </button>
        </div>
      )}

      {/* 4. Danh sách nhật ký nhóm theo Tháng (hoặc Loading / Skeleton đang lọc / Empty state) */}
      {isFiltering ? (
        <div className="space-y-3 pt-2 animate-fade-in">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3.5 rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-2xs animate-pulse"
            >
              {/* Icon skeleton */}
              <div className="h-12 w-12 rounded-2xl bg-slate-100 shrink-0 mt-0.5" />
              {/* Content skeleton */}
              <div className="flex-1 space-y-2 py-0.5">
                <div className="flex items-center justify-between gap-4">
                  <div className="h-4 bg-slate-100 rounded-md w-1/3" />
                  <div className="h-3 bg-slate-100 rounded-full w-16" />
                </div>
                <div className="h-3 bg-slate-100 rounded-md w-1/2" />
                <div className="h-3 bg-slate-100 rounded-md w-2/5" />
                <div className="h-3 bg-slate-100 rounded-md w-3/5" />
                <div className="flex gap-2 pt-1">
                  <div className="h-10 w-10 rounded-xl bg-slate-100" />
                  <div className="h-10 w-10 rounded-xl bg-slate-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/50 p-6 text-center space-y-2 mt-3 animate-fade-in">
          <p className="text-sm font-medium text-rose-700">
            Không tải được danh sách nhật ký
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="text-xs font-bold text-rose-600 underline"
          >
            Thử tải lại
          </button>
        </div>
      ) : allEntries.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center space-y-3 mt-4 animate-fade-in">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <NotebookPen className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              Chưa có nhật ký phù hợp
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Thử thay đổi bộ lọc hoặc tạo nhật ký mới cho ngày hôm nay
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
            {hasActiveFilter && (
              <button
                type="button"
                onClick={handleResetAllFilters}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" /> Xóa bộ lọc
              </button>
            )}
            <Link
              href="/diary/incident"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
            >
              <NotebookPen className="h-3.5 w-3.5" /> Ghi nhật ký mới
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4 pt-1 animate-fade-in">
          {groupedByMonth.map((group) => (
            <section key={group.monthKey} className="space-y-2.5">
              {/* Tiêu đề nhóm Tháng (vd: Tháng 10/2026) */}
              <h2 className="text-base font-bold text-slate-900 px-0.5">
                {group.monthKey}
              </h2>

              {/* Danh sách thẻ trong tháng */}
              <div className="space-y-2.5">
                {group.entries.map((entry) => (
                  <MobileDiaryCard key={entry.id} entry={entry} />
                ))}
              </div>
            </section>
          ))}

          {/* Sentinel element tự động kích hoạt Infinite Scroll khi cuộn tới */}
          <div ref={sentinelRef} className="py-2 flex justify-center">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 py-3 text-xs font-medium text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                Đang tải thêm nhật ký...
              </div>
            )}
            {!hasNextPage && allEntries.length > 5 && (
              <p className="text-center text-xs text-slate-400 py-3">
                Đã hiển thị toàn bộ nhật ký
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
