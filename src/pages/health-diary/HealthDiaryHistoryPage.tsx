import React, { useState, useMemo, useEffect } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertTriangle,
  Camera,
  Clock,
  Filter,
  HeartPulse,
  Layers,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { useLocation } from "wouter";
import { useHealthDiaryStore } from "@/features/health-diary/stores/useHealthDiaryStore";
import type {
  HealthDiaryRecord,
  HealthStatusType,
} from "@/features/health-diary/types/health-diary.types";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { HealthUpdateHistoryTable } from "./components/table/HealthUpdateHistoryTable";
import {
  HealthDiaryAdvancedFilterPanel,
  type HealthDiaryFilters,
  type Option,
} from "./components/lookup/HealthDiaryAdvancedFilterPanel";

export default function HealthDiaryHistoryPage() {
  const [, setLocation] = useLocation();
  const { records, deleteRecord } = useHealthDiaryStore();

  // Search & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Advanced Filter Panel Open State
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(true);

  // Draft and Applied Filters (Matching UpdateHistoryPage pattern)
  const [draftFilters, setDraftFilters] = useState<HealthDiaryFilters>({
    methodTypes: [],
    statuses: [],
    zoneIds: [],
    fromDate: "",
    toDate: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<HealthDiaryFilters>({
    methodTypes: [],
    statuses: [],
    zoneIds: [],
    fromDate: "",
    toDate: "",
  });

  // Modal detail record
  const [selectedRecord, setSelectedRecord] =
    useState<HealthDiaryRecord | null>(null);

  // Reset page to 0 when search query or applied filters change
  useEffect(() => {
    setPage(0);
  }, [debouncedSearchQuery, appliedFilters]);

  // Compute Active Filter Count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.methodTypes.length > 0)
      count += appliedFilters.methodTypes.length;
    if (appliedFilters.statuses.length > 0)
      count += appliedFilters.statuses.length;
    if (appliedFilters.zoneIds.length > 0)
      count += appliedFilters.zoneIds.length;
    if (appliedFilters.fromDate) count += 1;
    if (appliedFilters.toDate) count += 1;
    return count;
  }, [appliedFilters]);

  const toggleFilter = (
    key: "methodTypes" | "statuses" | "zoneIds",
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
    const empty: HealthDiaryFilters = {
      methodTypes: [],
      statuses: [],
      zoneIds: [],
      fromDate: "",
      toDate: "",
    };
    setDraftFilters(empty);
    setAppliedFilters(empty);
    setSearchQuery("");
  };

  // Filter options definitions
  const methodTypeOptions: Option[] = useMemo(
    () => [
      { id: "ZONE_SCOPE", name: "Phạm vi vùng trồng" },
      { id: "INDIVIDUAL_PLANT", name: "Cá thể từng cây trồng" },
    ],
    [],
  );

  const statusOptions: Option[] = useMemo(
    () => [
      { id: "DISEASE_DETECTED", name: "Phát hiện bệnh" },
      { id: "UNDER_TREATMENT", name: "Đang điều trị" },
      { id: "HEALTHY", name: "Sức khỏe tốt" },
    ],
    [],
  );

  const zoneOptions: Option[] = useMemo(() => {
    const uniqueZones = Array.from(
      new Set(records.map((r) => r.zoneName)),
    ).filter(Boolean);
    return uniqueZones.map((zName) => ({
      id: zName,
      name: zName,
    }));
  }, [records]);

  // Filtered records list based on appliedFilters & debouncedSearchQuery
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchMethod =
        appliedFilters.methodTypes.length === 0 ||
        appliedFilters.methodTypes.includes(rec.methodType);

      const matchStatus =
        appliedFilters.statuses.length === 0 ||
        appliedFilters.statuses.includes(rec.status);

      const matchZone =
        appliedFilters.zoneIds.length === 0 ||
        appliedFilters.zoneIds.includes(rec.zoneName);

      const q = debouncedSearchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        rec.code.toLowerCase().includes(q) ||
        rec.notes.toLowerCase().includes(q) ||
        rec.zoneName.toLowerCase().includes(q) ||
        (rec.targetScopeNames &&
          rec.targetScopeNames.some((s) => s.toLowerCase().includes(q))) ||
        (rec.plantCodes &&
          rec.plantCodes.some((p) => p.toLowerCase().includes(q)));

      let matchDate = true;
      if (appliedFilters.fromDate) {
        matchDate = matchDate && rec.createdAt >= appliedFilters.fromDate;
      }
      if (appliedFilters.toDate) {
        matchDate =
          matchDate && rec.createdAt <= `${appliedFilters.toDate} 23:59`;
      }

      return matchMethod && matchStatus && matchZone && matchQuery && matchDate;
    });
  }, [records, appliedFilters, debouncedSearchQuery]);

  // Statistics calculation (matching UpdateHistoryPage.tsx stat blocks)
  const totalUpdates = filteredRecords.length;
  const withEvidence = useMemo(
    () =>
      filteredRecords.filter((r) => r.imageUrls && r.imageUrls.length > 0)
        .length,
    [filteredRecords],
  );
  const withoutEvidence = Math.max(0, totalUpdates - withEvidence);

  const countDisease = useMemo(
    () => filteredRecords.filter((r) => r.status === "DISEASE_DETECTED").length,
    [filteredRecords],
  );
  const countTreatment = useMemo(
    () => filteredRecords.filter((r) => r.status === "UNDER_TREATMENT").length,
    [filteredRecords],
  );
  const countHealthy = useMemo(
    () => filteredRecords.filter((r) => r.status === "HEALTHY").length,
    [filteredRecords],
  );

  const formattedLatestUpdate = useMemo(() => {
    if (filteredRecords.length === 0) return "Chưa có cập nhật";
    return filteredRecords[0].createdAt;
  }, [filteredRecords]);

  // Paginated records for table
  const totalPages = Math.ceil(totalUpdates / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = page * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, page, pageSize]);

  const renderStatusBadge = (status: HealthStatusType) => {
    if (status === "DISEASE_DETECTED") {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 text-xs font-bold gap-1 py-1 px-2.5"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          <span>Phát hiện bệnh</span>
        </Badge>
      );
    }
    if (status === "UNDER_TREATMENT") {
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-bold gap-1 py-1 px-2.5"
        >
          <Stethoscope className="w-3.5 h-3.5 text-amber-500" />
          <span>Đang điều trị</span>
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold gap-1 py-1 px-2.5"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Sức khỏe tốt</span>
      </Badge>
    );
  };

  return (
    <PageWrapper
      title="Lịch sử cập nhật sức khỏe"
      description="Danh sách nhật ký sức khỏe vùng trồng và cá thể cây trồng mới nhất"
    >
      <div className="space-y-6 pb-12">
        {/* ── STAT BLOCKS (3 Cards Grid - 1:1 like UpdateHistoryPage.tsx) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Block 1: Tổng số lần cập nhật */}
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Tổng lượt cập nhật sức khỏe
                </p>
                <p className="text-3xl font-extrabold text-slate-800 leading-none">
                  {totalUpdates}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                <HeartPulse className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-[11px]">
              <div className="flex items-center gap-1 font-bold text-red-600">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>{countDisease} Bệnh</span>
              </div>
              <div className="w-px h-3.5 bg-slate-200" />
              <div className="flex items-center gap-1 font-bold text-amber-600">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>{countTreatment} Đang điều trị</span>
              </div>
              <div className="w-px h-3.5 bg-slate-200" />
              <div className="flex items-center gap-1 font-bold text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{countHealthy} Tốt</span>
              </div>
            </div>
          </div>

          {/* Block 2: Số nhật ký có ảnh bằng chứng */}
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Nhật ký có ảnh minh họa
                </p>
                <p className="text-3xl font-extrabold text-slate-800 leading-none">
                  {withEvidence}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                <Camera className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
              Chiếm{" "}
              <span className="font-extrabold text-blue-700">
                {totalUpdates > 0
                  ? Math.round((withEvidence / totalUpdates) * 100)
                  : 0}
                %
              </span>{" "}
              tổng số lượt ghi nhật ký sức khỏe
            </p>
          </div>

          {/* Block 3: Cập nhật mới nhất */}
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Cập nhật mới nhất
                </p>
                <p className="text-xl font-extrabold text-slate-800 leading-none truncate">
                  {formattedLatestUpdate}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
              Thời gian ghi nhận nhật ký gần đây nhất
            </p>
          </div>
        </div>

        {/* ── SEARCH & ADVANCED FILTER HEADER (1:1 like UpdateHistoryPage.tsx) ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full group">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600"
                size={18}
              />
              <Input
                placeholder="Tìm kiếm nhật ký sức khỏe theo mã, tên vùng, ghi chú, mã cây..."
                className="pl-10 h-11 border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20 transition-all rounded-xl bg-slate-50/50 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto shrink-0">
              <Button
                variant={isAdvancedSearchOpen ? "default" : "outline"}
                className={cn(
                  "flex-1 md:w-48 justify-center h-11 px-4 rounded-xl font-bold border-slate-200 transition-all cursor-pointer text-xs",
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
                    className="ml-2 h-5 px-1.5 min-w-[20px] justify-center bg-emerald-700 text-white border-none shadow-xs font-bold text-[10px]"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* HealthDiaryAdvancedFilterPanel Component */}
          <HealthDiaryAdvancedFilterPanel
            isOpen={isAdvancedSearchOpen}
            filters={draftFilters}
            onToggleFilter={toggleFilter}
            onDateChange={setDateFilter}
            onReset={resetFilters}
            onApply={applyFilters}
            resultCount={totalUpdates}
            methodTypeOptions={methodTypeOptions}
            statusOptions={statusOptions}
            zoneOptions={zoneOptions}
          />

          {!isAdvancedSearchOpen && (
            <div className="relative overflow-hidden rounded-xl border border-emerald-200 bg-linear-to-r from-emerald-50 via-white to-emerald-50 p-3 shadow-2xs">
              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white shadow-xs border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Layers className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
                      Tổng quan kết quả lọc
                    </h3>
                    <p className="text-xs text-emerald-700/80 font-medium mt-0.5">
                      Có{" "}
                      <span className="text-emerald-700 font-extrabold px-1.5 py-0.5 bg-white rounded-md border border-emerald-200 shadow-2xs">
                        {totalUpdates}
                      </span>{" "}
                      nhật ký sức khỏe phù hợp với tiêu chí hiện tại.
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

        {/* ── UNIFIED HISTORY TABLE (Reusing UpdateHistoryTable pattern) ── */}
        <HealthUpdateHistoryTable
          records={paginatedRecords}
          pageSize={pageSize}
          currentIndex={page + 1}
          totalElements={totalUpdates}
          totalPages={totalPages}
          onPageSize={(newSize) => {
            setPageSize(newSize);
            setPage(0);
          }}
          onIndexChange={(newIndex) => setPage(newIndex - 1)}
          onOpenDetail={(record) => setSelectedRecord(record)}
          onDeleteRecord={(recordId) => deleteRecord(recordId)}
        />

        {/* DETAIL MODAL DIALOG */}
        {selectedRecord && (
          <Dialog
            open={!!selectedRecord}
            onOpenChange={() => setSelectedRecord(null)}
          >
            <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
              <DialogHeader className="p-6 bg-slate-50 border-b">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-emerald-600" />
                    <span>Chi tiết nhật ký sức khỏe {selectedRecord.code}</span>
                  </DialogTitle>
                </div>
              </DialogHeader>

              <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block">
                      Vùng canh tác:
                    </span>
                    <span className="font-bold text-slate-800">
                      {selectedRecord.zoneName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">
                      Phương thức:
                    </span>
                    <span>
                      {selectedRecord.methodType === "ZONE_SCOPE"
                        ? "Phạm vi vùng trồng"
                        : "Cá thể từng cây trồng"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">
                      Thời gian cập nhật:
                    </span>
                    <span className="font-bold text-slate-800">
                      {selectedRecord.createdAt}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">
                      Tình trạng:
                    </span>
                    <span className="mt-1 inline-block">
                      {renderStatusBadge(selectedRecord.status)}
                    </span>
                  </div>
                </div>

                {/* Scope or Plant IDs */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-slate-400 font-semibold block">
                    {selectedRecord.methodType === "ZONE_SCOPE"
                      ? "Phạm vi áp dụng:"
                      : "Danh sách mã cây trồng:"}
                  </span>
                  {selectedRecord.methodType === "ZONE_SCOPE" ? (
                    <div className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800">
                      {selectedRecord.targetScopeNames?.join(", ") ||
                        selectedRecord.regionName}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-xl max-h-36 overflow-y-auto">
                      {selectedRecord.plantCodes?.map((code) => (
                        <Badge
                          key={code}
                          variant="outline"
                          className="bg-white border-slate-200 text-slate-700"
                        >
                          {code}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-1 text-xs">
                  <span className="text-slate-400 font-semibold block">
                    Ghi chú diễn biến:
                  </span>
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed font-medium">
                    {selectedRecord.notes || "Không có ghi chú"}
                  </div>
                </div>

                {/* Photo Gallery */}
                {selectedRecord.imageUrls.length > 0 && (
                  <div className="space-y-2 text-xs">
                    <span className="text-slate-400 font-semibold block">
                      Bộ sưu tập ảnh đính kèm:
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedRecord.imageUrls.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-xl overflow-hidden aspect-square border border-slate-200"
                        >
                          <img
                            src={url}
                            alt={`Ảnh ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-all"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PageWrapper>
  );
}
