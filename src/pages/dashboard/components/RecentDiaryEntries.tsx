import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  useIsMobile,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Camera,
  ClipboardList,
  Clock,
  ImageOff,
  Layers,
  ChevronRight,
} from "lucide-react";
import { useLocation } from "wouter";
import {
  useFarmDailyDiaryEntries,
  useFarmDailyDiaryStats,
} from "@/features/farm-daily-diary";
import type { FarmPlanPurpose } from "@/features/farm-daily-diary/types/farm-daily-diary.type";
import { FARM_PLAN_PURPOSE_LABELS } from "@/shared/constants/farm.constants";
import { UpdateHistoryTable } from "@/pages/diary/components/table/UpdateHistoryTable";

export type { FarmPlanPurpose };

export const PURPOSE_MAP: Record<string, { label: string; className: string }> =
  {
    CULTIVATION: {
      label: FARM_PLAN_PURPOSE_LABELS.CULTIVATION,
      className:
        "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold",
    },
    FACILITY_UPGRADE: {
      label: FARM_PLAN_PURPOSE_LABELS.FACILITY_UPGRADE,
      className: "bg-blue-50 text-blue-700 border border-blue-200 font-bold",
    },
    TREATMENT: {
      label: FARM_PLAN_PURPOSE_LABELS.TREATMENT,
      className: "bg-amber-50 text-amber-700 border border-amber-200 font-bold",
    },
    SOIL_IMPROVEMENT: {
      label: FARM_PLAN_PURPOSE_LABELS.SOIL_IMPROVEMENT,
      className:
        "bg-orange-50 text-orange-700 border border-orange-200 font-bold",
    },
    HARVEST: {
      label: FARM_PLAN_PURPOSE_LABELS.HARVEST,
      className:
        "bg-purple-50 text-purple-700 border border-purple-200 font-bold",
    },
    NUTRITION: {
      label: FARM_PLAN_PURPOSE_LABELS.NUTRITION,
      className:
        "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold",
    },
    PLANT_CARE: {
      label: FARM_PLAN_PURPOSE_LABELS.PLANT_CARE,
      className: "bg-teal-50 text-teal-700 border border-teal-200 font-bold",
    },
    PEST_DISEASE: {
      label: FARM_PLAN_PURPOSE_LABELS.PEST_DISEASE,
      className: "bg-amber-50 text-amber-700 border border-amber-200 font-bold",
    },
    WEED_CONTROL: {
      label: FARM_PLAN_PURPOSE_LABELS.WEED_CONTROL,
      className: "bg-lime-50 text-lime-700 border border-lime-200 font-bold",
    },
    IRRIGATION: {
      label: FARM_PLAN_PURPOSE_LABELS.IRRIGATION,
      className: "bg-sky-50 text-sky-700 border border-sky-200 font-bold",
    },
    OTHER: {
      label: FARM_PLAN_PURPOSE_LABELS.OTHER,
      className: "bg-gray-50 text-gray-700 border border-gray-200 font-bold",
    },
  };

export function RecentDiaryEntries() {
  const isMobile = useIsMobile();
  const [, setLocation] = useLocation();
  const [page, setPage] = useState(0);
  const size = 10;

  // Query Daily Diary Entries (AD_HOC)
  const { data: dailyDiaryPageData, isLoading: isDailyLoading } =
    useFarmDailyDiaryEntries({
      params: { page, size },
    });

  const { data: dailyStatsData } = useFarmDailyDiaryStats({
    params: { page, size },
  });

  const totalUpdates =
    dailyStatsData?.totalUpdates ?? dailyDiaryPageData?.totalElements ?? 0;
  const withEvidence = dailyStatsData?.withEvidence ?? 0;
  const withoutEvidence =
    dailyStatsData?.withoutEvidence ?? Math.max(0, totalUpdates - withEvidence);

  const formattedLatestUpdate = useMemo(() => {
    const raw = dailyStatsData?.latestUpdatedAt;
    if (!raw) return "Chưa có cập nhật";
    const date = new Date(raw);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });
  }, [dailyStatsData?.latestUpdatedAt]);

  const handleOpenHistoryPage = () => {
    setLocation("/diary/daily-history");
  };

  return (
    <Card className="rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden bg-white">
      <CardHeader
        className={
          isMobile
            ? "flex flex-row items-center justify-between gap-2 space-y-0 p-3 border-b border-slate-100 bg-slate-50/50"
            : "flex flex-row items-center justify-between p-4 pb-3 border-b border-slate-100 bg-slate-50/50"
        }
      >
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Lịch sử cập nhật nhật ký
            </h3>
            <p className="text-xs font-normal text-slate-500">
              Thống kê và danh sách 10 công việc cập nhật mới nhất
            </p>
          </div>
        </CardTitle>

        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenHistoryPage}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100 border-emerald-200 rounded-xl h-9 px-3 shrink-0"
        >
          <span>{isMobile ? "Tất cả" : "Xem tất cả nhật ký"}</span>
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </CardHeader>

      <CardContent className={isMobile ? "p-3 space-y-4" : "p-4 space-y-6"}>
        {/* ── 3 STAT BLOCKS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        {/* ── UPDATE HISTORY TABLE (10 WORK ITEMS) ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Danh sách nhật ký thường nhật (Tối đa 10 công việc)
              </h4>
            </div>
          </div>

          <UpdateHistoryTable
            isDaily={true}
            dailyEntries={dailyDiaryPageData?.content || []}
            plannedEntries={[]}
            pageSize={10}
            showDownload={false}
            showFilter={false}
            currentIndex={page + 1}
            totalElements={dailyDiaryPageData?.totalElements ?? 0}
            totalPages={dailyDiaryPageData?.totalPages ?? 0}
            onPageSize={() => {}}
            onIndexChange={(newIndex) => setPage(newIndex - 1)}
            loading={isDailyLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
