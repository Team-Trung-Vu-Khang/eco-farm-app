import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Activity,
  Award,
  Download,
  Info,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  FileCheck2,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  useAdminActiveFarmersReport,
  useAdminExportActiveFarmersJob,
} from "@/features/farm/hooks/useAdminDashboard";
import type { ActiveFarmerItem } from "@/features/farm/types/admin-dashboard.type";

import dayjs from "dayjs";

function generateRecentMonthsOptions(count = 12) {
  const options = [];
  let current = dayjs();
  for (let i = 0; i < count; i++) {
    const value = current.format("YYYY-MM");
    const label = `Tháng ${current.format("MM/YYYY")}`;
    options.push({ value, label });
    current = current.subtract(1, "month");
  }
  return options;
}

function formatLatestDiaryText(
  latestDiary: any,
  latestDiaryType?: string | null,
): string {
  if (!latestDiary) return "Chưa có nhật ký trong tháng";

  if (
    latestDiary.lines &&
    Array.isArray(latestDiary.lines) &&
    latestDiary.lines.length > 0
  ) {
    const taskNames = latestDiary.lines
      .map((l: any) => l.task?.name || l.taskName || l.title || l.purpose)
      .filter(Boolean);
    if (taskNames.length > 0) {
      return taskNames.join(" & ");
    }
  }

  if (latestDiary.purpose) return latestDiary.purpose;
  if (latestDiary.code) return `Nhật ký ${latestDiary.code}`;

  return latestDiaryType === "DAILY"
    ? "Nhật ký hằng ngày"
    : "Nhật ký công việc";
}

export function AdminActiveFarmerReportBlock() {
  const monthOptions = useMemo(() => generateRecentMonthsOptions(12), []);
  const [selectedMonth, setSelectedMonth] = useState(
    () => monthOptions[0]?.value || dayjs().format("YYYY-MM"),
  );

  const { data, isLoading, error } = useAdminActiveFarmersReport({
    month: selectedMonth,
    size: 20,
  });

  const { startExport, isExporting, createError, jobStatusData, resetExport } =
    useAdminExportActiveFarmersJob();

  // Watch jobStatusData for auto download when DONE
  useEffect(() => {
    if (jobStatusData?.status === "DONE" && jobStatusData.fileUrl) {
      const link = document.createElement("a");
      link.href = jobStatusData.fileUrl;
      link.target = "_blank";
      link.download = jobStatusData.fileName || "active-farmers-report.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resetExport();
    }
  }, [jobStatusData, resetExport]);

  const isForbidden = (error as any)?.response?.status === 403;

  if (isForbidden) {
    return (
      <Alert
        variant="destructive"
        className="bg-amber-50 border-amber-200 text-amber-900 rounded-2xl p-4"
      >
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <AlertTitle className="font-bold text-sm text-amber-800">
            Không có quyền truy cập báo cáo Active Farmers (403 Forbidden)
          </AlertTitle>
          <AlertDescription className="text-xs text-amber-700 mt-0.5">
            Tính năng này yêu cầu quyền Admin hệ thống (MEVI_ADMIN /
            MEVI_SUPER_ADMIN).
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  const summary = data?.summary ?? {
    totalCount: 0,
    activeCount: 0,
    inactiveCount: 0,
    activePercent: 0,
  };

  const criteria = data?.criteria ?? { minActiveDays: 2, minSupplyEntries: 1 };
  const items = data?.items ?? [];
  const dataThrough = data?.dataThrough;

  const pieChartData = [
    {
      name: "Active (Đạt chuẩn)",
      value: summary.activeCount,
      color: "#10b981",
    },
    {
      name: "Không Active (Chưa đạt)",
      value: summary.inactiveCount,
      color: "#cbd5e1",
    },
  ];

  const handleExportTop20Active = async () => {
    try {
      await startExport({
        month: selectedMonth,
        status: "ACTIVE",
        limit: 20,
        format: "xlsx",
        fileName: `top20-active-farmers-${selectedMonth}`,
        columns: [
          { key: "rank", header: "Hạng" },
          { key: "code", header: "Mã Nông trại" },
          { key: "name", header: "Tên Nông hộ / HTX" },
          { key: "organizationType", header: "Loại hình" },
          { key: "province", header: "Tỉnh / Thành" },
          { key: "district", header: "Quận / Huyện" },
          { key: "status", header: "Trạng thái" },
          { key: "diaryCount", header: "Số nhật ký" },
          { key: "supplyEntryCount", header: "Số lượt vật tư" },
          { key: "activeDays", header: "Số ngày hoạt động" },
          { key: "lastActiveDate", header: "Ngày hoạt động gần nhất" },
          { key: "entriesPerWeek", header: "Tần suất (lượt/tuần)" },
        ],
        i18n: {
          "status.ACTIVE": "Đang hoạt động",
          "status.INACTIVE": "Chưa hoạt động",
          "organizationType.ENTERPRISE": "Doanh nghiệp",
          "organizationType.COOPERATIVE": "Hợp tác xã",
          "organizationType.FARM_HOUSEHOLD": "Nông hộ",
        },
      });
    } catch (err: any) {
      console.error("Failed to start export top 20 active job", err);
    }
  };

  const handleExportInactive = async () => {
    try {
      await startExport({
        month: selectedMonth,
        status: "INACTIVE",
        format: "xlsx",
        fileName: `inactive-farmers-${selectedMonth}`,
        columns: [
          { key: "code", header: "Mã Nông trại" },
          { key: "name", header: "Tên Nông hộ / HTX" },
          { key: "organizationType", header: "Loại hình" },
          { key: "province", header: "Tỉnh / Thành" },
          { key: "district", header: "Quận / Huyện" },
          { key: "status", header: "Trạng thái" },
          { key: "diaryCount", header: "Số nhật ký" },
          { key: "activeDays", header: "Số ngày hoạt động" },
          { key: "lastActiveDate", header: "Ngày hoạt động gần nhất" },
        ],
        i18n: {
          "status.ACTIVE": "Đang hoạt động",
          "status.INACTIVE": "Chưa hoạt động",
          "organizationType.ENTERPRISE": "Doanh nghiệp",
          "organizationType.COOPERATIVE": "Hợp tác xã",
          "organizationType.FARM_HOUSEHOLD": "Nông hộ",
        },
      });
    } catch (err: any) {
      console.error("Failed to start export inactive job", err);
    }
  };

  const isBusyConflict = (createError as any)?.response?.status === 409;

  return (
    <Card className="shadow-sm border-slate-200/80 rounded-2xl overflow-hidden bg-white">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          {/* Left Side: Title & Info + Month Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 shrink-0 shadow-2xs">
                <Activity className="w-5 h-5" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="font-bold text-base text-slate-800 leading-tight">
                    Báo cáo Tình hình Hoạt động Nông hộ (Active Farmers)
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger className="cursor-pointer inline-flex items-center">
                      <Info className="w-4 h-4 text-slate-400 hover:text-emerald-600 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs font-medium leading-relaxed bg-slate-900 text-white p-3 rounded-xl shadow-xl">
                      <p className="font-bold text-emerald-400 mb-1">
                        Quy chuẩn Nông hộ Active:
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-[11px]">
                        <li>
                          Có <strong>≥ {criteria.minActiveDays} ngày</strong>{" "}
                          hoạt động cập nhật khác nhau trong tháng.
                        </li>
                        <li>
                          Có <strong>≥ {criteria.minSupplyEntries} lần</strong>{" "}
                          nhập dữ liệu thực tế (vật tư phân bón, thuốc BVTV...).
                        </li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                  {dataThrough && (
                    <Badge
                      variant="outline"
                      className="text-[10px] font-semibold bg-white text-slate-500 border-slate-200"
                    >
                      Dữ liệu đến ngày {dataThrough}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Theo dõi mức độ tuân thủ cập nhật nhật ký &amp; minh chứng vật
                  tư thực tế
                </p>
              </div>
            </div>

            {/* Month Selector */}
            <div className="shrink-0 sm:ml-1">
              <Select
                value={selectedMonth}
                onValueChange={(val) => setSelectedMonth(val)}
              >
                <SelectTrigger className="w-[170px] h-8 text-xs font-bold text-slate-700 bg-white border-slate-200 rounded-lg focus:ring-emerald-500 shadow-2xs gap-1.5 cursor-pointer">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <SelectValue placeholder="Chọn tháng" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((m) => (
                    <SelectItem
                      key={m.value}
                      value={m.value}
                      className="text-xs font-medium cursor-pointer"
                    >
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Side: The 2 Export Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 justify-start sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              disabled={isExporting}
              onClick={handleExportTop20Active}
              className="text-xs font-semibold h-8 border-slate-200 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 text-slate-700 rounded-lg gap-1.5 cursor-pointer shadow-2xs disabled:opacity-60"
              title="Tải về file Excel danh sách Top 20 Nông hộ Active"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin shrink-0" />
              ) : (
                <Download className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              )}
              <span>
                {isExporting
                  ? "Đang xuất file..."
                  : "Tải Top 20 Active (.XLSX)"}
              </span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={isExporting}
              onClick={handleExportInactive}
              className="text-xs font-semibold h-8 border-amber-200 bg-amber-50/50 hover:bg-amber-100 hover:border-amber-300 text-amber-800 rounded-lg gap-1.5 cursor-pointer shadow-2xs disabled:opacity-60"
              title="Tải về file Excel danh sách Nông hộ chưa Active để đội Mevi đôn đốc"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin shrink-0" />
              ) : (
                <Download className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              )}
              <span>
                {isExporting ? "Đang xuất..." : "Tải DS Inactive (.XLSX)"}
              </span>
            </Button>
          </div>
        </div>

        {isBusyConflict && (
          <div className="mt-2 text-xs text-amber-800 bg-amber-100 p-2 rounded-lg font-medium">
            ⚠️ Hệ thống đang xử lý một yêu cầu xuất dữ liệu khác. Vui lòng chờ
            vài giây rồi thử lại.
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-5 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (lg:col-span-4): Donut Chart & Active Standards */}
          <div className="lg:col-span-4 bg-slate-50/60 p-4 rounded-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Tỷ lệ Active{" "}
                {monthOptions.find((m) => m.value === selectedMonth)?.label ||
                  `Tháng ${selectedMonth}`}
              </span>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-bold">
                {isLoading
                  ? "..."
                  : `${summary.activePercent.toFixed(1)}% Active`}
              </Badge>
            </div>

            {/* Donut Chart Canvas */}
            <div className="h-[200px] w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={84}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-active-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(val: unknown, name: unknown) => {
                      const numVal =
                        typeof val === "number" ? val : Number(val) || 0;
                      const percentStr =
                        summary.totalCount > 0
                          ? ((numVal / summary.totalCount) * 100).toFixed(1)
                          : "0";
                      return [
                        `${numVal} Hộ (${percentStr}%)`,
                        String(name ?? ""),
                      ];
                    }}
                    wrapperStyle={{ zIndex: 1000 }}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                      fontWeight: 600,
                      zIndex: 1000,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Tổng nông hộ
                </span>
                <span className="text-xl font-black text-slate-800 leading-none mt-0.5">
                  {isLoading ? "..." : summary.totalCount}
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 mt-0.5">
                  đơn vị giám sát
                </span>
              </div>
            </div>

            {/* Active Rule Breakdown Info Card */}
            <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
              <div className="flex items-center justify-between text-slate-700 font-semibold border-b border-slate-100 pb-1.5">
                <span className="flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Active đạt chuẩn
                </span>
                <span className="font-bold text-slate-900">
                  {summary.activeCount} hộ ({summary.activePercent.toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600 font-medium">
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Chưa Active
                </span>
                <span className="font-bold text-amber-700">
                  {summary.inactiveCount} hộ (
                  {(100 - summary.activePercent).toFixed(1)}%)
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium leading-relaxed bg-slate-50 p-2 rounded-lg">
                💡 <strong>Điều kiện Active:</strong> ≥ {criteria.minActiveDays}{" "}
                ngày hoạt động/tháng &amp; ≥ {criteria.minSupplyEntries} lần
                nhập số liệu vật tư thực tế.
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (lg:col-span-8): Top 20 Active Farmers List */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider px-1">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Xếp hạng Top Nông hộ Active nhất trong tháng</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {items.length} Hộ dẫn đầu
              </span>
            </div>

            {isLoading ? (
              <div className="p-12 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto mb-2" />
                Đang tải danh sách Active Farmers...
              </div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                Không có dữ liệu nông hộ Active cho tháng {selectedMonth}.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {items.map((farmer: ActiveFarmerItem, idx: number) => {
                  const rankNum = farmer.rank ?? idx + 1;
                  const isTop1 = rankNum === 1;
                  const isTop2 = rankNum === 2;
                  const isTop3 = rankNum === 3;

                  const locationText =
                    [farmer.province, farmer.district]
                      .filter(Boolean)
                      .join(", ") || "Chưa cập nhật địa bàn";

                  const latestActivityText = formatLatestDiaryText(
                    farmer.latestDiary,
                    farmer.latestDiaryType,
                  );

                  return (
                    <div
                      key={farmer.workspaceId}
                      className="bg-white border border-slate-200/80 hover:border-emerald-300 rounded-xl p-3 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-xs"
                    >
                      {/* Left: Rank & Farm ID & Name & Location & Last Active Date & Activity */}
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {/* Rank Badge */}
                        <span
                          className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 border mt-0.5 ${
                            isTop1
                              ? "bg-amber-400 text-amber-950 border-amber-500 shadow-2xs"
                              : isTop2
                                ? "bg-slate-200 text-slate-800 border-slate-300"
                                : isTop3
                                  ? "bg-amber-700 text-amber-100 border-amber-800"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {rankNum}
                        </span>

                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {farmer.code && (
                              <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                                {farmer.code}
                              </span>
                            )}
                            <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">
                              {farmer.name}
                            </h4>
                            <span className="flex items-center gap-0.5 text-[11px] text-slate-500">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              {locationText}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 font-medium">
                            <span>
                              Hoạt động gần nhất:{" "}
                              <strong className="text-slate-800 font-mono">
                                {farmer.lastActiveDate || "—"}
                              </strong>
                            </span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold truncate max-w-[240px]">
                              {latestActivityText}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Stats */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 text-right">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-xs font-black text-slate-800 justify-end">
                            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{farmer.diaryCount} lần nhật ký</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            <strong className="text-slate-700">
                              {farmer.activeDays} ngày
                            </strong>{" "}
                            hoạt động
                            {farmer.entriesPerWeek != null &&
                              ` (${farmer.entriesPerWeek.toFixed(1)} lượt/tuần)`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
