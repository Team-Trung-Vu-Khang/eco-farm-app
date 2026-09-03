import {
  Badge,
  Button,
  DataTable,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Clock, Eye, Link2, PackageOpen, Zap } from "lucide-react";
import { useMemo } from "react";
import { useLocation } from "wouter";
import type { TaskHistoryItem } from "../mock/history.mock";

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

export function UpdateHistoryTable({
  data,
  onOpenDetail,
}: {
  data: TaskHistoryItem[];
  onOpenDetail?: (task: TaskHistoryItem) => void;
}) {
  const [, setLocation] = useLocation();

  const columns = useMemo<Column<TaskHistoryItem>[]>(
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
        key: "origin",
        label: "Phân loại",
        render: (_val, row) =>
          row.origin === "PLANNED" ? (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 font-bold gap-1 text-[11px]"
            >
              <Link2 className="w-3 h-3 text-blue-600" />
              Theo kế hoạch
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200 font-bold gap-1 text-[11px]"
            >
              <Zap className="w-3 h-3 text-purple-600" />
              Thường nhật
            </Badge>
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

  return (
    <DataTable
      columns={columns}
      data={data}
      searchable={false}
      searchPlaceholder="Tìm kiếm công việc theo tên, mã..."
    />
  );
}
