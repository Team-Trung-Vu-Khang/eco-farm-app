import {
  Badge,
  Button,
  DataTable,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Camera, Clock, Eye, Edit3, PackageOpen, Sprout } from "lucide-react";
import { useMemo } from "react";
import { useLocation } from "wouter";
import type { TaskHistoryItem } from "../../mock/history.mock";
import type {
  FarmDailyDiaryEntryResponse,
  FarmPlanPurpose,
} from "@/features/farm-daily-diary";
import type { PlanTaskDiaryEntryResponse } from "@/features/farm-plan-task-diary";

function formatDate(isoString: string) {
  if (!isoString) return "";
  const d = new Date(isoString);
  const timeStr = d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${timeStr} ${dateStr}`;
}

const PURPOSE_MAP: Record<
  FarmPlanPurpose,
  { label: string; className: string }
> = {
  CULTIVATION: {
    label: "Canh tác",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  FACILITY_UPGRADE: {
    label: "Nâng cấp CSVC",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  TREATMENT: {
    label: "Điều trị",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  SOIL_IMPROVEMENT: {
    label: "Cải tạo đất",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  HARVEST: {
    label: "Thu hoạch",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
};

export interface UpdateHistoryTableProps {
  data?: TaskHistoryItem[];
  dailyEntries?: FarmDailyDiaryEntryResponse[];
  plannedEntries?: PlanTaskDiaryEntryResponse[];
  isDaily?: boolean;
  onOpenDetail?: (task: TaskHistoryItem) => void;
  onOpenDailyDetail?: (entry: FarmDailyDiaryEntryResponse) => void;

  // Pagination & Search props for DataTable
  pageSize?: number;
  currentIndex?: number;
  totalElements?: number;
  totalPages?: number;
  onPageSize?: (size: number) => void;
  onIndexChange?: (page: number) => void;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (val: string) => void;
}

export function UpdateHistoryTable({
  data = [],
  dailyEntries = [],
  plannedEntries = [],
  isDaily = false,
  onOpenDetail,
  onOpenDailyDetail,

  pageSize,
  currentIndex,
  totalElements,
  totalPages,
  onPageSize,
  onIndexChange,
  loading = false,
  searchable = false,
  searchPlaceholder = "Tìm kiếm nhật ký...",
  onSearch,
}: UpdateHistoryTableProps) {
  const [, setLocation] = useLocation();

  const plannedEntryColumns = useMemo<Column<PlanTaskDiaryEntryResponse>[]>(
    () => [
      {
        key: "code",
        label: "Mã nhật ký & Thời gian",
        render: (_val, row) => (
          <div className="space-y-1 py-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                {row.code}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{formatDate(row.createdAt)}</span>
            </div>
          </div>
        ),
      },
      {
        key: "submittedBy",
        label: "Người báo cáo & Mô tả",
        render: (_val, row) => (
          <div className="space-y-1.5 py-1 max-w-[360px]">
            {row.submittedByPersonnel?.fullName && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border bg-slate-100 text-slate-700 border-slate-200 inline-block">
                Bởi: {row.submittedByPersonnel.fullName}
              </span>
            )}
            {row.description && (
              <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed bg-slate-50/60 p-2 rounded-lg border border-slate-100">
                {row.description}
              </p>
            )}
          </div>
        ),
      },
      {
        key: "lines",
        label: "Công việc kế hoạch & Tiến độ",
        render: (_val, row) => {
          const linesCount = row.lines?.length ?? 0;
          if (linesCount === 0) {
            return (
              <span className="text-xs text-slate-400 italic">
                Không có công việc
              </span>
            );
          }
          const firstLine = row.lines[0];
          const progressVal =
            typeof firstLine.progressPercent === "number"
              ? `${firstLine.progressPercent}%`
              : firstLine.executorProgress &&
                  firstLine.executorProgress.length > 0
                ? `${firstLine.executorProgress[0].progressPercent}%`
                : null;

          return (
            <div className="space-y-1 py-1 max-w-[320px]">
              <div className="flex items-center gap-2">
                {progressVal && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {progressVal}
                  </span>
                )}
                <p className="text-xs font-bold text-slate-900 line-clamp-1">
                  {firstLine.taskName || `Công việc #${firstLine.taskId}`}
                </p>
              </div>
              {firstLine.description && (
                <p className="text-[11px] text-slate-600 truncate">
                  {firstLine.description}
                </p>
              )}
              {linesCount > 1 && (
                <span className="text-[10px] font-bold text-slate-400">
                  +{linesCount - 1} công việc khác
                </span>
              )}
            </div>
          );
        },
      },
      {
        key: "evidence",
        label: "Bằng chứng",
        render: (_val, row) => {
          const photoCount = row.photos?.length ?? 0;
          const harvestCount = row.harvestItems?.length ?? 0;
          return (
            <div className="space-y-1 py-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Camera className="w-3.5 h-3.5 text-green-600 shrink-0" />
                <span className="font-semibold text-slate-800">
                  {photoCount}
                </span>
                <span className="text-slate-400 text-[11px]">ảnh</span>
              </div>
              {harvestCount > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-purple-700">
                  <Sprout className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="font-semibold">{harvestCount}</span>
                  <span className="text-[11px]">mục thu hoạch</span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        key: "actions",
        label: "Hành động",
        render: (_val, row) => (
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                const targetTaskId = row.lines?.[0]?.taskId || row.id;
                setLocation(`/diary/update/${targetTaskId}?type=PLANNED`);
              }}
              className="h-8 px-2.5 rounded-lg text-xs font-bold gap-1 border-slate-200 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-green-600" />
              Xem
            </Button>
          </div>
        ),
      },
    ],
    [setLocation],
  );

  const plannedColumns = useMemo<Column<TaskHistoryItem>[]>(
    () => [
      {
        key: "taskName",
        label: "Tên công việc & Quy trình",
        render: (_val, row) => (
          <div className="space-y-1 py-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                {row.taskCode}
              </span>
              <p className="text-xs font-bold text-slate-900 line-clamp-1 hover:text-green-700 transition-colors">
                {row.taskName}
              </p>
            </div>

            {row.origin === "PLANNED" ? (
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                {row.planName && (
                  <span className="truncate max-w-[280px] text-slate-600 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    <span className="text-slate-400">KH:</span> {row.planName}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md inline-block">
                {row.taskCategoryName || "Công việc thường nhật"}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "latestUpdate",
        label: "Nội dung cập nhật mới nhất",
        render: (_val, row) => {
          const log = row.latestUpdate;
          return (
            <div className="space-y-1.5 py-1 max-w-[420px]">
              <div className="flex items-center gap-2">
                {log.completionPercent !== undefined && (
                  <span
                    className={`text-[11px] font-black px-2 py-0.5 rounded-md border ${
                      log.completionPercent === 100
                        ? "text-green-700 bg-green-50 border-green-200"
                        : "text-amber-700 bg-amber-50 border-amber-200"
                    }`}
                  >
                    {log.completionPercent}%
                  </span>
                )}
                <span className="text-[11px] text-slate-500 font-medium truncate">
                  Bởi {log.updaterName}
                </span>
              </div>
              <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed bg-slate-50/60 p-2 rounded-lg border border-slate-100">
                {log.note}
              </p>
              {log.supplies && log.supplies.length > 0 && (
                <div className="flex items-center gap-1.5 text-[10px] text-amber-700 font-semibold">
                  <PackageOpen className="w-3 h-3 text-amber-600 shrink-0" />
                  <span className="truncate">
                    Vật tư:{" "}
                    {log.supplies
                      .map((s) => `${s.name} (${s.actualQty} ${s.unit})`)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        key: "updatedAt",
        label: "Thời gian cập nhật",
        render: (_val, row) => (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{formatDate(row.latestUpdate.updatedAt)}</span>
          </div>
        ),
      },
      {
        key: "actions",
        label: "Hành động",
        render: (_val, row) => {
          if (row.origin === "PLANNED") {
            return (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setLocation(`/diary/update/${row.id}`);
                  if (onOpenDetail) onOpenDetail(row);
                }}
                className="h-8 px-3 rounded-lg text-xs font-bold gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-2xs cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 text-green-600" />
                Xem chi tiết
              </Button>
            );
          }
          return null;
        },
      },
    ],
    [setLocation, onOpenDetail],
  );

  const dailyColumns = useMemo<Column<FarmDailyDiaryEntryResponse>[]>(
    () => [
      {
        key: "code",
        label: "Mã nhật ký & Thời gian",
        render: (_val, row) => (
          <div className="space-y-1 py-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                {row.code}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{formatDate(row.createdAt)}</span>
            </div>
          </div>
        ),
      },
      {
        key: "purpose",
        label: "Mục đích & Nội dung",
        render: (_val, row) => {
          const purposeConfig = PURPOSE_MAP[row.purpose] || {
            label: row.purpose,
            className: "bg-slate-100 text-slate-700 border-slate-200",
          };
          return (
            <div className="space-y-1.5 py-1 max-w-[360px]">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block ${purposeConfig.className}`}
              >
                {purposeConfig.label}
              </span>
              {row.description && (
                <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed bg-slate-50/60 p-2 rounded-lg border border-slate-100">
                  {row.description}
                </p>
              )}
            </div>
          );
        },
      },
      {
        key: "lines",
        label: "Công việc phát sinh",
        render: (_val, row) => {
          const linesCount = row.lines?.length ?? 0;
          if (linesCount === 0) {
            return (
              <span className="text-xs text-slate-400 italic">
                Ghi nhận chung
              </span>
            );
          }
          const firstLine = row.lines[0];
          const locationName =
            firstLine.plot?.name ||
            firstLine.area?.name ||
            firstLine.region?.name ||
            "";

          return (
            <div className="space-y-1 py-1 max-w-[300px]">
              <p className="text-xs font-bold text-slate-900 line-clamp-1">
                {firstLine.name}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                {firstLine.taskCategory?.name && (
                  <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                    {firstLine.taskCategory.name}
                  </span>
                )}
                {locationName && (
                  <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    {locationName}
                  </span>
                )}
              </div>
              {linesCount > 1 && (
                <span className="text-[10px] font-bold text-slate-400">
                  +{linesCount - 1} công việc khác
                </span>
              )}
            </div>
          );
        },
      },
      {
        key: "evidence",
        label: "Bằng chứng & Thu hoạch",
        render: (_val, row) => {
          const photoCount = row.photos?.length ?? 0;
          const harvestCount = row.harvestItems?.length ?? 0;
          return (
            <div className="space-y-1 py-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Camera className="w-3.5 h-3.5 text-green-600 shrink-0" />
                <span className="font-semibold text-slate-800">
                  {photoCount}
                </span>
                <span className="text-slate-400 text-[11px]">ảnh</span>
              </div>
              {harvestCount > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-purple-700">
                  <Sprout className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="font-semibold">{harvestCount}</span>
                  <span className="text-[11px]">mục thu hoạch</span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        key: "editable",
        label: "Trạng thái sửa",
        render: (_val, row) => (
          <div>
            {row.editable ? (
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                Có thể sửa (24h)
              </Badge>
            ) : (
              <Badge className="bg-slate-100 text-slate-500 border-slate-200 text-[10px] font-medium">
                Hết hạn sửa
              </Badge>
            )}
          </div>
        ),
      },
      {
        key: "actions",
        label: "Hành động",
        render: (_val, row) => (
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenDailyDetail) {
                  onOpenDailyDetail(row);
                } else {
                  setLocation(`/diary/update/${row.id}`);
                }
              }}
              className="h-8 px-2.5 rounded-lg text-xs font-bold gap-1 border-slate-200 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-green-600" />
              Xem
            </Button>
            {row.editable && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setLocation(`/diary/incident?editId=${row.id}`);
                }}
                className="h-8 px-2.5 rounded-lg text-xs font-bold gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5 text-emerald-600" />
                Sửa
              </Button>
            )}
          </div>
        ),
      },
    ],
    [setLocation, onOpenDailyDetail],
  );

  const columnsToUse = isDaily
    ? (dailyColumns as any)
    : (plannedEntryColumns as any);
  const dataToUse = isDaily ? dailyEntries : (plannedEntries ?? []);


  return (
    <DataTable
      columns={columnsToUse}
      data={dataToUse}
      searchable={searchable}
      searchPlaceholder={searchPlaceholder}
      onSearch={onSearch}
      pageSize={pageSize}
      currentIndex={currentIndex}
      totalElements={totalElements}
      totalPages={totalPages}
      onPageSize={onPageSize}
      onIndexChange={onIndexChange}
      loading={loading}
    />
  );
}
