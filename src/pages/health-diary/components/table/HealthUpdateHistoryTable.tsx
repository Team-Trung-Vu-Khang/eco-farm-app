import React, { useMemo } from "react";
import {
  Badge,
  Button,
  DataTable,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertTriangle,
  Camera,
  Clock,
  Eye,
  ShieldCheck,
  Stethoscope,
  Trash2,
} from "lucide-react";
import { useLocation } from "wouter";
import type {
  HealthDiaryRecord,
  HealthStatusType,
} from "@/features/health-diary/types/health-diary.types";

export interface HealthUpdateHistoryTableProps {
  records?: HealthDiaryRecord[];
  pageSize?: number;
  currentIndex?: number;
  totalElements?: number;
  totalPages?: number;
  onPageSize?: (size: number) => void;
  onIndexChange?: (page: number) => void;
  loading?: boolean;
  onOpenDetail?: (record: HealthDiaryRecord) => void;
  onDeleteRecord?: (recordId: number) => void;
}

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

export function HealthUpdateHistoryTable({
  records = [],
  pageSize = 10,
  currentIndex = 1,
  totalElements = 0,
  totalPages = 1,
  onPageSize,
  onIndexChange,
  loading = false,
  onOpenDetail,
  onDeleteRecord,
}: HealthUpdateHistoryTableProps) {
  const [, setLocation] = useLocation();

  const columns = useMemo<Column<HealthDiaryRecord>[]>(
    () => [
      {
        key: "code",
        label: "Mã nhật ký & Thời gian",
        render: (_val, row, index) => {
          const pageIdx =
            typeof currentIndex === "number" &&
            !isNaN(currentIndex) &&
            currentIndex > 0
              ? currentIndex
              : 1;
          const size =
            typeof pageSize === "number" && !isNaN(pageSize) && pageSize > 0
              ? pageSize
              : 10;
          const stt = (pageIdx - 1) * size + index + 1;
          return (
            <div className="space-y-1 py-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-medium shrink-0 min-w-5">
                  #{stt}
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {row.code}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{row.createdAt}</span>
              </div>
            </div>
          );
        },
      },
      {
        key: "zoneName",
        label: "Vùng canh tác",
        render: (_val, row) => (
          <div className="space-y-1 py-1 max-w-[200px]">
            <p
              className="font-bold text-slate-800 text-xs truncate"
              title={row.zoneName}
            >
              {row.zoneName}
            </p>
          </div>
        ),
      },
      {
        key: "methodType",
        label: "Phương thức",
        render: (_val, row) => (
          <div className="py-1">
            {row.methodType === "ZONE_SCOPE" ? (
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold"
              >
                Phạm vi vùng
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold"
              >
                Cá thể cây ({row.plantCount || row.plantCodes?.length || 0})
              </Badge>
            )}
          </div>
        ),
      },
      {
        key: "scopeOrPlants",
        label: "Phạm vi / Mã cây",
        render: (_val, row) => (
          <div className="py-1 max-w-xs">
            {row.methodType === "ZONE_SCOPE" ? (
              <div className="font-semibold text-slate-700 truncate text-xs">
                {row.targetScopeNames?.join(", ") ||
                  row.regionName ||
                  row.zoneName}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1 max-w-xs">
                {row.plantCodes?.slice(0, 3).map((code) => (
                  <Badge
                    key={code}
                    variant="secondary"
                    className="text-[10px] bg-slate-100 text-slate-700"
                  >
                    {code}
                  </Badge>
                ))}
                {(row.plantCodes?.length || 0) > 3 && (
                  <span className="text-[10px] text-slate-400 font-bold">
                    +{row.plantCodes!.length - 3} cây khác
                  </span>
                )}
              </div>
            )}
          </div>
        ),
      },
      {
        key: "status",
        label: "Tình trạng",
        render: (_val, row) => (
          <div className="py-1">{renderStatusBadge(row.status)}</div>
        ),
      },
      {
        key: "notes",
        label: "Ghi chú & Ảnh",
        render: (_val, row) => (
          <div className="space-y-1 py-1 max-w-md">
            <p className="text-slate-700 text-xs line-clamp-2 leading-relaxed bg-slate-50/60 p-2 rounded-lg border border-slate-100">
              {row.notes || "---"}
            </p>
            {row.imageUrls && row.imageUrls.length > 0 && (
              <div className="flex items-center gap-2 pt-0.5">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                  <Camera className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <span>{row.imageUrls.length} ảnh</span>
                </div>
                <div className="flex items-center gap-1">
                  {row.imageUrls.slice(0, 3).map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Minh họa"
                      className="w-6 h-6 rounded-md object-cover border border-slate-200"
                    />
                  ))}
                  {row.imageUrls.length > 3 && (
                    <span className="text-[10px] text-slate-400 font-bold">
                      +{row.imageUrls.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ),
      },
      {
        key: "actions",
        label: "Thao tác",
        render: (_val, row) => (
          <div className="flex items-center gap-1 justify-end py-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenDetail) onOpenDetail(row);
                setLocation(`/diary/health-detail/${row.id}`);
              }}
              className="h-8 px-2.5 rounded-lg text-xs font-bold gap-1 border-slate-200 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              title="Xem chi tiết"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              Xem
            </Button>
            {/* <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (onDeleteRecord) onDeleteRecord(row.id);
              }}
              className="h-8 px-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-all cursor-pointer"
              title="Xóa bản ghi"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button> */}
          </div>
        ),
      },
    ],
    [currentIndex, pageSize, onOpenDetail, setLocation],
  );

  return (
    <DataTable
      columns={columns}
      data={records}
      pageSize={pageSize}
      currentIndex={currentIndex}
      totalElements={totalElements}
      totalPages={totalPages}
      onPageSize={onPageSize}
      onIndexChange={onIndexChange}
      loading={loading}
      searchable={false}
    />
  );
}
