import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
  DataTable,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Activity,
  Calendar,
  Info,
  CheckCircle2,
  FileCheck2,
  ShieldAlert,
  History,
  Camera,
  Layers,
  Clock,
  User,
  X,
  Loader2,
} from "lucide-react";
import dayjs from "dayjs";
import {
  useAdminDiaryActivitySummary,
  useAdminDiaryActivityWorkspaces,
} from "@/features/farm/hooks/useAdminDiaryActivity";
import { farmDailyDiaryApi } from "@/features/farm-daily-diary/api/farm-daily-diary.api";
import type {
  AdminWorkspaceStatus,
  AdminDiaryWorkspaceItem,
} from "@/features/farm/types/admin-diary-activity.type";

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

const ORG_TYPE_LABELS: Record<string, string> = {
  ENTERPRISE: "Doanh nghiệp",
  COOPERATIVE: "Hợp tác xã",
  FARM_HOUSEHOLD: "Nông hộ",
};

const STATUS_CONFIG: Record<
  AdminWorkspaceStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Đang hoạt động",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  INACTIVE: {
    label: "Tạm ngưng",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  ARCHIVED: {
    label: "Lưu trữ",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

export const AdminDiaryActivitySection: React.FC = () => {
  const monthOptions = useMemo(() => generateRecentMonthsOptions(12), []);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    () => monthOptions[0]?.value || dayjs().format("YYYY-MM"),
  );

  // Search Debounce state
  const [keywordInput, setKeywordInput] = useState<string>("");
  const [activeKeyword, setActiveKeyword] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    AdminWorkspaceStatus | "ALL"
  >("ALL");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // History Drawer & Lightbox Zoom state
  const [selectedHistoryWorkspace, setSelectedHistoryWorkspace] =
    useState<AdminDiaryWorkspaceItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Debounce search effect (400ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveKeyword(keywordInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [keywordInput]);

  // 1. Summary Query
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useAdminDiaryActivitySummary(selectedMonth);

  // 2. Workspaces Query (Convert 1-indexed UI page to 0-indexed API page)
  const {
    data: workspacesData,
    isLoading: isWorkspacesLoading,
    error: workspacesError,
  } = useAdminDiaryActivityWorkspaces({
    month: selectedMonth,
    keyword: activeKeyword || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    page: Math.max(0, page - 1),
    size: pageSize,
  });

  // 3. Real Workspace Diary Entries Query (Pass target workspaceId to header)
  const { data: realDiaryEntries, isLoading: isDiariesLoading } = useQuery({
    queryKey: [
      "workspace-diary-entries-admin",
      selectedHistoryWorkspace?.workspaceId,
      selectedMonth,
    ],
    queryFn: async () => {
      const targetWorkspaceId = selectedHistoryWorkspace?.workspaceId;
      if (!targetWorkspaceId) return null;

      const fromDate = dayjs(selectedMonth, "YYYY-MM")
        .startOf("month")
        .format("YYYY-MM-DD");
      const toDate = dayjs(selectedMonth, "YYYY-MM")
        .endOf("month")
        .format("YYYY-MM-DD");

      try {
        const res = await farmDailyDiaryApi.listGeneral(
          {
            diaryType: "DAILY",
            fromDate,
            toDate,
            size: 50,
          },
          targetWorkspaceId,
        );
        return res?.content || [];
      } catch (e) {
        return null;
      }
    },
    enabled: Boolean(selectedHistoryWorkspace?.workspaceId),
  });

  const isForbidden =
    (summaryError as any)?.response?.status === 403 ||
    (workspacesError as any)?.response?.status === 403;

  const criteria = summaryData?.criteria ?? {
    minActiveDays: 2,
    minSupplyEntries: 1,
  };
  const activeMetric = summaryData?.active ?? { count: 0, percent: 0 };
  const evidenceMetric = summaryData?.evidence ?? { count: 0, percent: 0 };
  const totalCount = summaryData?.totalCount ?? 0;
  const dataThrough = summaryData?.dataThrough;

  // Generate dynamic timeline updates ONLY from real API entries
  const timelineUpdates = useMemo(() => {
    if (
      !selectedHistoryWorkspace ||
      !realDiaryEntries ||
      realDiaryEntries.length === 0
    ) {
      return [];
    }

    return realDiaryEntries.map((entry: any, idx: number) => {
      const line = entry.lines?.[0];
      const actorName =
        entry.createdByName ||
        entry.workflow?.name ||
        "Nông hộ / Kỹ thuật viên";
      const actionTitle =
        line?.name || entry.purpose || "Cập nhật nhật ký canh tác";
      const detailsText =
        entry.description ||
        line?.description ||
        (entry.code ? `Mã nhật ký: ${entry.code}` : "Chưa có ghi chú chi tiết");

      const images = (entry.photos || [])
        .map((p: any) => p.fileUrl || p.thumbnail?.fileUrl)
        .filter(Boolean) as string[];

      const rawDate =
        entry.createdAt ||
        entry.entryDate ||
        selectedHistoryWorkspace.lastActiveDate;

      const formattedTimestamp =
        rawDate && dayjs(rawDate).isValid()
          ? dayjs(rawDate).format("HH:mm - DD/MM/YYYY")
          : dayjs().format("HH:mm - DD/MM/YYYY");

      return {
        id: entry.id || `entry-${idx}`,
        timestamp: formattedTimestamp,
        actor: actorName,
        action: actionTitle,
        details: detailsText,
        images,
      };
    });
  }, [selectedHistoryWorkspace, realDiaryEntries]);

  // Define Columns for eco-shared-ui DataTable
  const adminDiaryWorkspaceColumns: Column<AdminDiaryWorkspaceItem>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Nông hộ / HTX / Công ty",
        render: (_, item) => {
          const orgLabel = item.organizationType
            ? ORG_TYPE_LABELS[item.organizationType] || item.organizationType
            : "Chưa gán loại hình";

          return (
            <div className="space-y-0.5 py-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">{item.name}</span>
                {item.code && (
                  <span className="text-[10px] font-bold font-mono text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                    MÃ: {item.code}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 block">
                {orgLabel}
              </span>
            </div>
          );
        },
      },
      {
        key: "activeDays",
        label: "Ngày hoạt động",
        render: (value) => (
          <span className="font-semibold text-slate-800 font-mono">
            {value} ngày
          </span>
        ),
      },
      {
        key: "diaryCount",
        label: "Cập nhật canh tác",
        render: (value, item) => (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 font-mono">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{value} lần</span>
            </div>
            <span className="text-[11px] text-slate-400 block">
              ({item.supplyEntryCount} lần vật tư)
            </span>
          </div>
        ),
      },
      {
        key: "status",
        label: "Trạng thái đơn vị",
        render: (value) => {
          const statusCfg =
            STATUS_CONFIG[value as AdminWorkspaceStatus] ||
            STATUS_CONFIG.ACTIVE;
          return (
            <Badge
              variant="outline"
              className={`text-[10px] font-bold ${statusCfg.className}`}
            >
              {statusCfg.label}
            </Badge>
          );
        },
      },
      {
        key: "workspaceId",
        label: "Hành động",
        render: (_, item) => {
          const hasDiaries = item.diaryCount > 0;
          return (
            <div className="text-right">
              {hasDiaries ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedHistoryWorkspace(item)}
                  className="h-8 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg gap-1.5 cursor-pointer"
                >
                  <History className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Xem lịch sử</span>
                </Button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        className="h-8 text-xs font-semibold text-slate-400 opacity-50 cursor-not-allowed rounded-lg gap-1.5"
                      >
                        <History className="w-3.5 h-3.5 text-slate-400" />
                        <span>Xem lịch sử</span>
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs font-medium bg-slate-900 text-white p-2 rounded-lg">
                    Đơn vị chưa có nhật ký trong tháng này
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          );
        },
      },
    ],
    [],
  );

  const handleMonthChange = (val: string) => {
    setSelectedMonth(val);
    setPage(1);
  };

  if (isForbidden) {
    return (
      <Alert
        variant="destructive"
        className="bg-amber-50 border-amber-200 text-amber-900 rounded-2xl p-4"
      >
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <AlertTitle className="font-bold text-sm text-amber-800">
            Không có quyền truy cập Báo cáo Nhật ký hoạt động (403 Forbidden)
          </AlertTitle>
          <AlertDescription className="text-xs text-amber-700 mt-0.5">
            Tính năng này yêu cầu quyền Admin hệ thống (MEVI_ADMIN /
            MEVI_FARM_ADMIN / MEVI_SUPER_ADMIN).
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base text-slate-800">
                Nhật ký Hoạt động Nông nghiệp (Admin)
              </h3>
              {dataThrough && (
                <Badge
                  variant="outline"
                  className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  Dữ liệu đến ngày{" "}
                  {dayjs(dataThrough).isValid()
                    ? dayjs(dataThrough).format("DD/MM/YYYY")
                    : dataThrough}
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Tra cứu &amp; giám sát mức độ tuân thủ cập nhật nhật ký của toàn
              bộ nông hộ / HTX
            </p>
          </div>
        </div>

        {/* Month Picker */}
        <div className="shrink-0 flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            Kỳ báo cáo:
          </span>
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[170px] h-9 text-xs font-bold text-slate-700 bg-white border-slate-200 rounded-lg shadow-2xs cursor-pointer gap-1.5">
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* KPI 1: Active Rate */}
        <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-2xs overflow-hidden">
          <CardContent className="p-5 flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tỷ lệ đơn vị Active
                </span>
                <Tooltip>
                  <TooltipTrigger className="cursor-pointer inline-flex items-center">
                    <Info className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-600 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs font-medium leading-relaxed bg-slate-900 text-white p-3 rounded-xl shadow-xl">
                    <p className="font-bold text-emerald-400 mb-1">
                      Điều kiện Active:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[11px]">
                      <li>
                        Có <strong>≥ {criteria.minActiveDays} ngày</strong> hoạt
                        động khác nhau trong tháng.
                      </li>
                      <li>
                        Có{" "}
                        <strong>≥ {criteria.minSupplyEntries} nhật ký</strong>{" "}
                        có vật tư đã nhập số lượng thực tế &gt; 0.
                      </li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-800 font-mono">
                  {isSummaryLoading
                    ? "..."
                    : `${activeMetric.percent.toFixed(1)}%`}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {isSummaryLoading
                    ? "..."
                    : `${activeMetric.count}/${totalCount} đơn vị`}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 font-medium">
                Cùng định nghĩa và phạm vi tính với báo cáo Active Farmers
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Evidence Rate */}
        <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-2xs overflow-hidden">
          <CardContent className="p-5 flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tỷ lệ đơn vị có bằng chứng
                </span>
                <Tooltip>
                  <TooltipTrigger className="cursor-pointer inline-flex items-center">
                    <Info className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs font-medium leading-relaxed bg-slate-900 text-white p-3 rounded-xl shadow-xl">
                    <p className="text-[11px]">
                      Workspace có ít nhất 1 nhật ký đính kèm hình ảnh minh
                      chứng trong tháng (
                      <code className="text-emerald-400">
                        hasEvidence = true
                      </code>
                      ).
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-800 font-mono">
                  {isSummaryLoading
                    ? "..."
                    : `${evidenceMetric.percent.toFixed(1)}%`}
                </span>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                  {isSummaryLoading
                    ? "..."
                    : `${evidenceMetric.count}/${totalCount} đơn vị`}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 font-medium">
                Đơn vị có nhật ký chứa ảnh chụp minh chứng thực địa
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
              <Camera className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card using eco-shared-ui DataTable */}
      <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-2xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 p-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4.5 h-4.5 text-emerald-600" />
            <CardTitle className="text-sm font-bold text-slate-800">
              Bảng tra cứu hoạt động nông hộ &amp; hợp tác xã
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <DataTable
            columns={adminDiaryWorkspaceColumns}
            data={workspacesData?.content || []}
            selectable={false}
            loading={isWorkspacesLoading}
            searchable={true}
            downloadable={false}
            searchPlaceholder="Tìm tên hoặc mã đơn vị..."
            pageSize={pageSize}
            currentIndex={page}
            totalElements={workspacesData?.totalElements || 0}
            totalPages={workspacesData?.totalPages || 0}
            onSearch={(val) => {
              setKeywordInput(val);
            }}
            onPageSize={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            onIndexChange={(idx) => {
              setPage(idx);
            }}
            onFilterChange={(key, val) => {
              if (key === "status") {
                setStatusFilter((val || "ALL") as AdminWorkspaceStatus | "ALL");
                setPage(1);
              }
            }}
            filters={[
              {
                key: "status",
                label: "Trạng thái đơn vị",
                options: [
                  { label: "Tất cả trạng thái", value: "ALL" },
                  { label: "Đang hoạt động", value: "ACTIVE" },
                  { label: "Tạm ngưng", value: "INACTIVE" },
                  { label: "Lưu trữ", value: "ARCHIVED" },
                ],
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* ─── Timeline Sidebar Drawer (UI Cũ) ─── */}
      {selectedHistoryWorkspace && (
        <div
          className="fixed inset-0 z-50 overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setSelectedHistoryWorkspace(null)}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md transform bg-white shadow-2xl transition-all duration-300 ease-in-out border-l flex flex-col h-full animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-850 font-display uppercase">
                    Nhật ký: {selectedHistoryWorkspace.name}
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono font-bold tracking-wider">
                    MÃ: {selectedHistoryWorkspace.code || "---"} • CẬP NHẬT:{" "}
                    {selectedHistoryWorkspace.diaryCount} LẦN
                  </div>
                </div>
                <button
                  onClick={() => setSelectedHistoryWorkspace(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Content Timeline */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Timeline List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Lịch sử cập nhật hoạt động
                    </h4>
                    {isDiariesLoading && (
                      <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                    )}
                  </div>

                  {timelineUpdates.length > 0 ? (
                    <div className="relative border-l border-slate-200 ml-3.5 space-y-6 pb-2">
                      {timelineUpdates.map((update) => (
                        <div key={update.id} className="relative pl-7">
                          <span className="absolute -left-3.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm">
                            <Clock className="w-3.5 h-3.5" />
                          </span>

                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 text-[11px] text-slate-450 border-b border-slate-200/50 pb-2">
                              <span className="font-mono font-bold text-slate-700">
                                {update.timestamp}
                              </span>
                              <span className="flex items-center gap-1 font-semibold text-slate-600">
                                <User className="w-3 h-3 text-slate-400" />
                                {update.actor}
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              <h4 className="text-xs font-bold text-slate-800">
                                {update.action}
                              </h4>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {update.details}
                              </p>
                            </div>

                            {update.images && update.images.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {update.images.map((img, i) => (
                                  <button
                                    key={i}
                                    onClick={() => setLightboxImage(img)}
                                    className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 hover:border-emerald-500 cursor-zoom-in transition-all group shrink-0"
                                  >
                                    <img
                                      src={img}
                                      alt="Bằng chứng hoạt động"
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !isDiariesLoading ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-1">
                      <p className="text-xs font-bold text-slate-600">
                        Chưa có bài đăng nhật ký chi tiết
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Đơn vị chưa ghi nhận bài đăng nhật ký nào trong kỳ này.
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Image Lightbox Zoom Modal (UI Cũ) ─── */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center animate-in zoom-in-95 duration-200">
            <img
              src={lightboxImage}
              alt="Ảnh bằng chứng phóng to"
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
